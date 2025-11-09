export class Contact {
  constructor(
    public contactId: number,
    public contactNumber: number,
    public login: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public gender: string,
    public countryCode: string,
    public phoneNumber: string,
    public zipCode: string,
    public role: string,
    public state: string,
    public creationDate: string,
    public endValidityDate: string,
    public type: string,
    public guest: boolean,
    public active: boolean,
  ) {}
}
