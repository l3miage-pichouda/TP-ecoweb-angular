import { HttpInterceptorFn } from '@angular/common/http';

export const noCacheInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method === 'GET') {
    console.log(req);
    req = req.clone({
      params: req.params.set('_ts', Date.now().toString()),
    });
  }
  return next(req);
};
