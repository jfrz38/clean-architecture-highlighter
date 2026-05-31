import 'package:example/infrastructure/persistence/sql_user_repository.dart';
import 'package:example/application/use_cases/create_user.dart';
import 'package:example/domain/user/user_id.dart';

class User {
  final UserId id;

  User(this.id);
}
