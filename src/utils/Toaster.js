import * as Toastr from 'toastr';
import '../../node_modules/toastr/build/toastr.css';

export default class Toaster{
    static green(title: string, message: string){
        Toastr.success(message, title);
    }
}