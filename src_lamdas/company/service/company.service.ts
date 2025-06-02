import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "node:crypto";
import { CompanyEntity } from "../createCompany/model";

export class CompanyService {
    private readonly TABLE_NAME = 'Companies';
    private readonly client = new DynamoDBClient({});
    private readonly ddbDocClient = DynamoDBDocumentClient.from(this.client);

    async save(companyEntity: CompanyEntity) {
        companyEntity.id = randomUUID();

        const command = new PutCommand({
            TableName: this.TABLE_NAME,
            Item: companyEntity
        });

        await this.ddbDocClient.send(command);
    }

    async existCompany(companyEntity: CompanyEntity) {
        const cuit = companyEntity.cuit;

        const command = new QueryCommand({
            TableName: this.TABLE_NAME,
            KeyConditionExpression: 'cuit = :cuit',
            ExpressionAttributeValues: { ':cuit': cuit },
            Select: 'COUNT'
        });

        const result = await this.ddbDocClient.send(command);
        
        return !result.Count ? false : result.Count > 0;
    }

}