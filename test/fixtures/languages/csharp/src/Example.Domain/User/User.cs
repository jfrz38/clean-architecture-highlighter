namespace Example.Domain.User;

using Example.Infrastructure.Persistence;
using Example.Application.UseCases;
using Example.Domain.User.ValueObjects;

public sealed class User
{
    private readonly UserId id;
}
