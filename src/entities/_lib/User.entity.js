export class User {
  constructor(user) {
    this.original = user;

    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.status = user.status;
    this.imageUrl = user.imageUrl;
  }

  updateImage(imageUrl) {
    const original = { ...this.original };
    original.imageUrl = imageUrl;

    return new User(original);
  }
}