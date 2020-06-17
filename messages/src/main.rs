extern crate json_converter;

use std::error::Error;

use json_converter::{LambdaRequest, LambdaResponse, LambdaResponseBuilder};
use lambda_runtime::{error::HandlerError, lambda, Context};
use log::{self, error};
use serde_derive::{Deserialize, Serialize};
use simple_logger;

#[derive(Deserialize)]
struct MessageEventRequest {
    #[serde(rename = "name")]
    name: String,
}

#[derive(Serialize)]
struct MessageEventResponse {
    message: String,
}

fn main() -> Result<(), Box<dyn Error>> {
    simple_logger::init_with_level(log::Level::Debug)?;

    lambda!(handle_message);

    Ok(())
}

fn handle_message(
    e: LambdaRequest<MessageEventRequest>,
    c: Context,
) -> Result<LambdaResponse, HandlerError> {
    let payload = e.body();
    let name = &payload.name;

    if name == "" {
        let message = format!("Empty name in request {}", c.aws_request_id);
        error!("{}", message); // TODO
        return LambdaResponseBuilder::new().bad_request(&message).build();
    }

    LambdaResponseBuilder::new()
        .with_status(200)
        .with_json(MessageEventResponse {
            message: format!("yoo, '{}'!", name),
        })
        .build()
}
