package user

import (
	"github.com/example/project/infrastructure/persistence"
	"github.com/example/project/application/usecases"
	"github.com/example/project/domain/user/id"
)

type User struct {
	ID id.UserID
}

var _ = persistence.SqlUserRepository{}
var _ = usecases.CreateUser{}
