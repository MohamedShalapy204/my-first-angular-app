import { HttpEventType, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { tap } from "rxjs";

export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn){
  // console.log(req);
  let newRequest = req
  if(req.method === 'POST'){
    newRequest = req.clone({
      headers: req.headers.append('lang', 'en')
    }) 
  }

  return next(newRequest).pipe(
    tap((event)=>{
      if(event.type === HttpEventType.Response){
        console.log('Response received', event);

        if(event.status === 401){
          console.log('Unauthorized request');
        }
      }
    })
  );
}