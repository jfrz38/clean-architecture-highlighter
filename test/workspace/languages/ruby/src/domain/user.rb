require "infrastructure/persistence/sql_user_repository"
require "application/use_cases/create_user"
require "domain/user_id"

module Domain
  class User
    def initialize(id)
      @id = id
    end
  end
end
