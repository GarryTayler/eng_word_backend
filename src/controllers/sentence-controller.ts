import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { isEmpty } from 'class-validator';
import { Sentence } from './../entity/sentence';
class SentenceController {
    static getSentenceList = async(req: Request, res: Response) => {
        const { category_id } = req.body;
        if(isEmpty(category_id)) {
            return res.json({ errorCode: 400, errorMsg: 'invalid_param' });     
        }
        try {
            let query = getRepository(Sentence)
                        .createQueryBuilder("sentence")
                        .where('"sentence"."categoryId" = :id', {id: category_id})
                        .orderBy('"sentence"."id"', "ASC")
            let result = await query.getMany();
            let ret_data: Array<any>;
            ret_data = [];

            result.forEach(function(item) {
                let ret_item: { [k: string]: any } = {};
                ret_item = {
                    id: item.id,
                    sentence: item.sentence,
                    meaning: item.meaning,
                    parts: item.detail
                };
                ret_data.push(ret_item);
            });

            return res.json({ errorCode: 0, errorMsg: '', data: ret_data });
        }  
        catch(error) {
            console.log(error);
            return res.json({ errorCode: 500, errorMsg: "internal_server_error" });           
        }
    };
}

export default SentenceController;