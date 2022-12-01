module.exports = class UserDto {
  email;
  id;
  isActivated;
  role;
  avatarUrl;
  username;
  isBan;
  reasonBan;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.role = model.role;
    this.avatarUrl = model.avatarUrl;
    this.username = model.username;
    this.isBan = model.ban.isBan;
    this.reasonBan = model.ban.reasonBan;
  }
}