import { diskStorage } from 'multer';
import { existsSync, mkdirSync } from 'fs';
import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

export const gameStorage = { 
        storage: diskStorage({
            destination(req, file, callback) {
                const start = req.url.indexOf("upload/");
                const gameId = req.url.substring(start+7);

                //Kreira folder
                const uploadPath = `./public/games/${gameId}`;
                if(!existsSync(uploadPath))
                    mkdirSync(uploadPath, {recursive:true});

                callback(null, uploadPath);
            },
            filename(req, file, callback) {  
                const newFileName = `${Date.now()}-${file.originalname}`;
                callback(null, newFileName);
            },
        }),
        fileFilter(req, file, callback) {
            if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
            {
                return callback(null, false);
            }
            callback(null, true);
        },
}