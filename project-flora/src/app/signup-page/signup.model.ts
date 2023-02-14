export class Signup {
    public f_name: string;
    public l_name: string;
    public u_name: string;
    public email: string;
    public pass: string;

    constructor(f_name: string, l_name: string, u_name: string, email: string, pass: string ) {
        this.f_name = f_name;
        this.l_name = l_name;
        this.u_name = u_name;
        this.email = email;
        this.pass = pass;
    }
}