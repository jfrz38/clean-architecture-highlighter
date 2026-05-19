use crate::infrastructure::persistence::SqlUserRepository;
use crate::application::use_cases::CreateUser;
use crate::domain::user_id::UserId;

pub struct User {
    id: UserId,
}
