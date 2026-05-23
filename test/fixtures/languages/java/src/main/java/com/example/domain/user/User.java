package com.example.domain.user;

import com.example.infrastructure.persistence.SqlUserRepository;
import com.example.application.usecases.CreateUser;
import com.example.domain.user.UserId;

public class User {
    private final UserId id;

    public User(UserId id) {
        this.id = id;
    }
}
