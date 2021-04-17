

class companyController {


    constructor(){
        this.axios = require('axios');
        this.KEY=require('../api/google_places')
        this.getCompaniesByRegion =this.getCompaniesByRegion.bind(this);
        this.getCompanyDetails =this.getCompanyDetails.bind(this);
        this.getCompaniesWithoutWebsite=this.getCompaniesWithoutWebsite.bind(this);
        this.getAllCompaniesByRegion=this.getAllCompaniesByRegion.bind(this);
        this.saveJsonToExel = this.saveJsonToExel.bind(this);


    }


    getCompanyById(req,res){
    }

    getCompaniesByRadius(req,res){

    }

    async getCompanyDetails(id,fields){

        return this.axios.get("https://maps.googleapis.com/maps/api/place/details/json?place_id="+id+"&fields="+fields.join(",")+"&key="+this.KEY);

    }

    saveJsonToExel(data){
        const xl = require('excel4node');
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet('vtc');



        const headingColumnNames = [
            "name",
            "formatted_phone_number",
            "website"
        ]

        //Write Column Title in Excel file
        let headingColumnIndex = 1;
        headingColumnNames.forEach(heading => {
            ws.cell(1, headingColumnIndex++)
                .string(heading)
        });

//Write Data in Excel file
        let rowIndex = 2;
        data.forEach( record => {
            let columnIndex = 1;
            headingColumnNames.forEach(columnName =>{
                ws.cell(rowIndex,columnIndex++)
                    .string(record [columnName])
            });
            rowIndex++;
        });
        wb.write('./vtc/TeacherData.xlsx');


    }


    getAllCompaniesByRegion(){

    }

    async getAllCompaniesByRegion(region,keyword) {


        let all_places =[];
        let next_page_token="";

        while (next_page_token!== undefined) {

            const result = await this.getCompaniesByRegion(next_page_token);

            all_places = all_places.concat(result.all_places);
            next_page_token = result.next_page_token;

        }

        this.saveJsonToExel(all_places)
      //  await   res.xls('vtc_lille.xlsx', all_places);
        //res.status(200).json(all_places)

    }


    async getCompaniesByRegion(next_token,region,keyword) {

        const all_places =[];


        const request = next_token !=="" ?
            "https://maps.googleapis.com/maps/api/place/textsearch/json?key=" + this.KEY+"&query=vtc+à+lille"+"&pagetoken="+next_token
            :"https://maps.googleapis.com/maps/api/place/textsearch/json?key=" + this.KEY+"&query=vtc+à+lille"

        const {results,next_page_token} = await  this.axios.get(request)
            .then(allEstablishments => {

                return allEstablishments.data}).catch(err=>console.log(err));

        for (let place of results){
            const details = await this.getCompanyDetails(place.place_id, ["name","formatted_phone_number","website"]).then(details =>
                details.data.result);
            all_places.push(details)

        }

        return {all_places,next_page_token};


    }

    getCompaniesWithoutWebsite(companies){

        let cmW =[];
        companies.map(cm=>{
            if (cm!== undefined && cm.website===undefined)
                cmW.push(cm);
        })
        return cmW;
    }



}

module.exports = new companyController();
