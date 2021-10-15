const axios = require('axios');
const { json } = require('body-parser');
const { query, param } = require('express-validator');


class Tenant
{

    constructor()
    {
        this.TenantId=process.env.TENANT_ID;
        this.tenant_url = process.env.TENANT_URL;
        this.TenantPassword=process.env.TENANT_PASSWORD;
    }


    async LoadChannels(UserId)
    {
        let params=``;
        params+=`?UserId=${UserId}`;
        params+=`&TenantId=${this.TenantId}`;
        params+=`&TenantPassword=${this.TenantPassword}`; 
        return await axios.get(`${this.tenant_url}/users/LoadChannels${params}`);
    }
    
    
    async RegisterNewUser(user)
    {
        let data={};
        data.UserId=user.id;
        data.UserName=user.name;
        data.TenantId=this.TenantId;
        data.TenantPassword=this.TenantPassword;        
        return await axios.post(`${this.tenant_url}/users/RegisterNewUser`,data);
    
    }
    


    async LogoutUser(user)
    {

        let data={};
        data.UserId=user.id;
        data.TenantId=this.TenantId;
        return await axios.post(`${this.tenant_url}/users/LogoutUser`,data);
        
    }

   

}

module.exports = Tenant;
