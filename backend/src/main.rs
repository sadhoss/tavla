use std::collections::HashMap;
use axum::{
    extract::{Path, State},
    http::{HeaderValue, Method, StatusCode},
    routing::{get, post},
    Json, Router,
};
use axum_auth::AuthBearer;
use parking_lot::RwLock;
use serde_json::Value;
use tokio::net::TcpListener;
use tower_http::cors::CorsLayer;

mod types;
mod utils;
use types::{AppError, AppState, BoardAction, Message};
use utils::{graceful_shutdown, setup_redis};

#[tokio::main]
async fn main() {
    let host = std::env::var("HOST").unwrap_or("0.0.0.0".to_string());
    let port = std::env::var("PORT").unwrap_or("3000".to_string());
    let key = std::env::var("BACKEND_API_KEY").expect("Expected to find api key");

    let listener = TcpListener::bind(format!("{}:{}", host, port))
        .await
        .unwrap();

    let app_state = AppState {
        storage: std::sync::Arc::new(RwLock::new(HashMap::new())),
        key,
    };

    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST])
        .allow_credentials(true)
        .allow_origin([
            "http://localhost:3000".parse::<HeaderValue>().unwrap(),
            "https://tavla.dev.entur.no".parse::<HeaderValue>().unwrap(),
            "https://tavla.entur.no".parse::<HeaderValue>().unwrap(),
        ]);

    let app = Router::new()
        .route("/active", get(active_boards))
        .route("/refresh/:bid", post(trigger))
        .route("/update/:bid", post(update_board))
        .route("/alive", get(check_health))
        .route("/subscribe/:bid", get(subscribe))
        .with_state(app_state)
        .layer(cors);

    println!("Server running on {}:{}", host, port);
    axum::serve(listener, app)
        .with_graceful_shutdown(graceful_shutdown(CancellationToken::new(), TaskTracker::new()))
        .await
        .unwrap();
}

async fn check_health() -> StatusCode {
    StatusCode::OK
}

async fn active_boards(
    AuthBearer(token): AuthBearer,
    State(state): State<AppState>,
) -> Result<Json<Vec<String>>, AppError> {
    if token != state.key {
        return Err(AppError(anyhow::anyhow!("Unauthorized")));
    }
    let storage = state.storage.read();
    Ok(Json(storage.keys().cloned().collect()))
}

async fn trigger(
    Path(bid): Path<String>,
    AuthBearer(token): AuthBearer,
    State(state): State<AppState>,
    Json(payload): Json<Value>,
) -> Result<StatusCode, AppError> {
    if token != state.key {
        return Err(AppError(anyhow::anyhow!("Unauthorized")));
    }
    let mut storage = state.storage.write();
    storage.insert(bid, payload);
    Ok(StatusCode::OK)
}

async fn update_board(
    AuthBearer(token): AuthBearer,
    State(state): State<AppState>,
    Path(bid): Path<String>,
) -> Result<StatusCode, AppError> {
    if token != state.key {
        return Err(AppError(anyhow::anyhow!("Unauthorized")));
    }
    let mut storage = state.storage.write();
    storage.remove(&bid);
    Ok(StatusCode::OK)
}

async fn subscribe(
    Path(bid): Path<String>,
    State(state): State<AppState>,
) -> Result<Message, AppError> {
    let mut storage = state.storage.read();
    let payload = storage.get(&bid).cloned();
    Ok(Message::Refresh { payload })
}
