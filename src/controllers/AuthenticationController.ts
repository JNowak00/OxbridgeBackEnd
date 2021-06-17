import * as jwt from 'jsonwebtoken'

export function Authorize(req: any, res: any,role: any, callback:any){

    const token = req.headers['x-access-token'];

    if(!token){
        return callback(res.status(401).send({auth: false, message: 'No token provided'}));

    }
    jwt.verify(token, 'secret', (error:any,decoded: any) => {
        if(error){
            return callback(res.status(500).send({auth:false, message: 'Failed to authenticate token'}));
        }
        if(role ==="admin" && decoded.role !=="admin"){
            return callback(res.status(401).send({auth: false, message: "Not Authorize"}))
        }
        return callback(null, decoded);
    });
};
