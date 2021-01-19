$(document).ready(function(){

    let mycookie = Cookies.get('cheifTechnologist');
    
    if (mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self")   
    }

    let token = Cookies.get('cheifTechnologistToken');
    
    $('#helpersubmenu').load('helpercheifTechnologist.html div#helpersubmenu')
    $('#helperinfocheif').load('helpercheifTechnologist.html div#helperinfocheif' )    

    warehouseproducts();

    let globalcountProduct = 1;
    let globalcountTableid = 1;
    let productId = [];

    $(document).on("click", "#undobutton", function(){
        location.reload();
    })

    $('#search').keyup(function(){
        let count = 0;
        search_table($(this).val(), count);
    })

    function search_table(value, count){
        $('#tblData tbody tr').each(function(){
            let found = false;

            $(this).each(function(){
                if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0){
                    found = true;
                    count++;
                }
            })
            if (found){
                $(this).show();
                $('#counter').text(count + " ta topildi");
            }else{
                $(this).hide();
            }
        })
    }

    $('tbody').on("click", "#savebutton", function(){
        let arr = []
        let par = $(this).parent().parent()
        let p = par.children().length - 1;
        const biscuitid = parseFloat(par.children().eq(1).children().val());

        for (let i = 2; i < p; i++){
            const elem = par.children().eq(i);
            const val = parseFloat(elem.children().val())

            let productid = parseFloat(par.children().eq(i).attr('data-productid'))

            let dict = {
                "product": productid,
                "value": val,
                "biscuit": biscuitid
            }
            arr.push(dict);
            dict={}
        }

        $.ajax({
            type: "POST",
            url: `http://206.189.145.94/api/v1/recipe/`,
            headers: {
                'Accept':'application/json, text/plain, */*',
                'Content-type': 'application/json',
                'Authorization': `token ${token}`
            },
            data: JSON.stringify(arr),
        })
        .done(function(data){
            location.reload();
        })
        .fail(function(){
            alert("Internet yo'q");
        })
        })
    $('tbody').on("click", '#editbutton', function(){
        $(this).nextAll().eq(0).css("display", "block");
        $(this).nextAll().eq(2).css("display", "block");

        let par = $(this).parent().parent(); 
        let p = par.children().length - 1;
        
        for (let i = 3; i <= p; i++){
            elem = par.children(`td:nth-child(${i})`);
            elem.html(`<input  style='width:100%' type='number' step='0.001' value='${elem.text()}' required/>`);
        }
    })
    
    $(document).on("click", "#saveupdatebutton", function(){
        let arr = [];

        let par = $(this).parent().parent();
        let p = par.children().length - 1;
        const biscuitid = parseFloat(par.children("#attrbiscuitId").attr("data-biscuitId"));

        for (let i = 2; i < p; i++){
            let elem = par.children().eq(i);
            let val = parseFloat(elem.children().val())
            const productid = parseFloat(elem.attr("data-productid"));
            let dict = {
                "product": productid,
                "value": val,
                "biscuit": biscuitid
            }
            arr.push(dict);
            dict = {}
        }

        $.ajax({
            type: "put",
            url: `http://206.189.145.94/api/v1/recipe/update_or_detail/?biscuit_id=${biscuitid}`,
            headers: {
                'Accept':'application/json, text/plain, */*',
                'Content-type': 'application/json',
                'Authorization': `token ${token}`
            },
            data: JSON.stringify(arr),
        })
        .done(function(data){
            location.reload();
        })
        .fail(function(){
            alert("Internet yo'q");
        })
        })    
    $(document).on("click", "#addrowtable", function(){
        getBiscuit();

        let string = `<tr> <th scope="row">${globalcountProduct}</th> `;
        globalcountProduct++;
        
        string += ` <td> <select id = "BiscuitName" style='width:100%' class="select2_single" tabindex="0"></select> </td> `
        let qq;

        for (let i = 2; i <= globalcountTableid + 1; i++){
            qq = productId[i - 2];
            string += ` <td data-productId="${qq}" id='attrproductId'> <input style='width:100%' value="0" type="number" step="0.001" /></td> `
        }

        string += ` <td style="display:flex; flex-direction:row"> 
        <p style="font-size: 20px; display: none; margin-right:10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Qo'shish"     id="addrowtable"><i class="fa fa-plus-circle"></i></p>
        <p style="font-size: 20px; display: none; margin-right:10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="O'zgartirish" id="editbutton"><i class="fa fa-edit"></i></p>
        <p style="font-size: 20px; display: none; margin-right:10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Saqlash" id="saveupdatebutton"><button type="button" class="btn btn-outline-primary btn-sm">Saqlash</button></p>
        <p style="font-size: 20px; display: block; margin-right:10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Saqlash" id="savebutton"><button type="button" class="btn btn-outline-success btn-sm">Saqlash</button></p>
        <p style="font-size: 20px; display: block; margin-right: 10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Qayta yuklash" id="undobutton"><i class="fa fa-undo"></i></p>
            </td> 
        `
        string += ' </tr>'
        $("#tblData tbody").append(string);

    })


    function warehouseproducts(){
        let table = $("#retseptListHead");

        let thead = `<tr>
                        <th scope="col" style="font-size: 15px; position: sticky; top: 5px;">#</th>
                        <th scope="col" style="font-size: 15px; position: sticky; top: 5px;">Nomi</th> `

        $.ajax({
            type: "GET",
            url: 'http://206.189.145.94/api/v1/warehouse/products/',
            headers: {
                'Authorization': `token ${token}`
            },
            success: function(data){
                globalcountTableid = data.length;
                
                data.forEach(elem=>{
                    
                    let {product:{name}, product: {id}} = elem;
                    productId.push(id);

                    thead += ` <th scope="col" style="font-size: 15px; position: sticky; top: 5px;" data-id="${id}">${name}</th> `
                })

                thead += ` 
                <th scope="col" style="font-size: 15px; position: sticky; top: 5px;">Jarayon</th> </tr>`

                table.html(thead);
            },
            failure: function(res){
                alert("Internet yo'q")
            }
        })

        $.ajax({
            type: "GET",
            url: "http://206.189.145.94/api/v1/biscuit/",
            headers: {
                'Authorization': `token ${token}`
            },
            success: function(biscuitdata){
                let count = biscuitdata.length;

                for (let j = 0; j < count; j++){
                    let biscuitid = parseInt(biscuitdata[j].id)

                    $.ajax({
                        type:"get",
                        url: `http://206.189.145.94/api/v1/recipe/update_or_detail/?biscuit_id=${biscuitid}`,
                        headers: {
                            'Authorization': `token ${token}`
                        },
                        success: function(retseptdata){
                            let lengretsept = retseptdata.length, name;

                            if (lengretsept !== 0){
                                name = (retseptdata[0].biscuit["name"]);

                                tbody = `<tr>
                                <th scope="row">${globalcountProduct}</th>
                                <td style="font-size: 14px;" data-biscuitId="${biscuitid}" id='attrbiscuitId'>${name}</td> `

                                for (let i = 0; i < productId.length; i++){
                                    let d = productId[i];
                                    let find = false;

                                    for (let k = 0; k < lengretsept; k++){

                                        if (retseptdata[k].product != null){
                                            if (retseptdata[k].product["id"] == d){
                                                tbody += `<td style="font-size: 14px;" data-productid="${d}" id='attrproductId'>${retseptdata[k].value}</td> `
                                                find = true;
                                                break;
                                            }
                                        }
                                    }
                                    if(find == false){
                                        tbody += `<td style="font-size: 14px;"  data-productid="${d}" id='attrproductId'>0</td> `
                                    }
                                }
                                tbody += ` 
                                <td style="display:flex; flex-direction:row"> 
                                    <p style="font-size: 20px; margin-right: 10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Qo'shish"     id="addrowtable"><i class="fa fa-plus-circle"></i></p>
                                    <p style="font-size: 20px; margin-right: 10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="O'zgartirish" id="editbutton"><i class="fa fa-edit"></i></p>
                                    <p style="font-size: 20px; display: none; margin-right:10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Saqlash" id="saveupdatebutton"><button type="button" class="btn btn-outline-primary btn-sm">Saqlash</button></p>
                                    <p style="font-size: 20px; display: none; margin-right:10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Saqlash" id="savebutton"><button type="button" class="btn btn-outline-success btn-sm">Saqlash</button></p>
                                    <p style="font-size: 20px; display: none; margin-right: 10px; cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Qayta yuklash" id="undobutton"><i class="fa fa-undo"></i></p>
                                </td> 
                                `
                                tbody += ' </tr';
                                $("#retseptListBody").append(tbody);
                                globalcountProduct++;
                            }
                        }
                    })
                }
            },
            failure: function(res) {
                alert("Internet yo'q");
            }
        })

    }
    

    function getBiscuit(){
        
        $.ajax({
            type: "GET",
            url: "http://206.189.145.94/api/v1/biscuit/",
            headers: {
                'Authorization': `token ${token}`
            },
            success: function(data){
                let biscuits = document.querySelectorAll("#BiscuitName");
                let count = biscuits.length - 1;
            
                data.forEach(elem=>{
                    let element = document.createElement("option");
                    element.textContent = elem.name;
                    element.setAttribute("value", elem.id);
                    biscuits[count].append(element);
                })
            },
            failure: function(res) {
                alert("INternet yo'q");
            }
        })
    }

})