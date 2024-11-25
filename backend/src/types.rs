use std::collections::HashMap;
use axum::{
    http::StatusCode,
    response::IntoResponse,
};
use parking_lot::RwLock;
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Clone)]
pub struct AppState {
    pub storage: std::sync::Arc<RwLock<HashMap<String, Value>>>,
    pub key: String,
}

#[derive(Serialize)]
#[serde(tag = "type", rename_all = "lowercase")]
pub enum Message {
    Refresh { payload: Value },
    Update,
}

#[derive(Serialize, Deserialize)]
pub enum BoardAction {
    Refresh { payload: Value },
    Update,
}

#[derive(Debug)]
pub struct AppError(anyhow::Error);

impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        (StatusCode::INTERNAL_SERVER_ERROR, self.0.to_string()).into_response()
    }
}

impl<E> From<E> for AppError
where
    E: Into<anyhow::Error>,
{
    fn from(err: E) -> Self {
        Self(err.into())
    }
}
