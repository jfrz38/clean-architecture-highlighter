<?php

namespace App\Domain\User;

use App\Infrastructure\Persistence\SqlUserRepository;
use App\Application\UseCases\CreateUser;
use App\Domain\User\UserId;

final class User
{
    public function __construct(private UserId $id)
    {
    }
}
