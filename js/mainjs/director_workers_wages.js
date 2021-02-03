$(document).ready(function(){
    
    mycookie = Cookies.get("director");

    if (mycookie == "false" || mycookie == undefined){
        window.open('index.html', "_self");
    }
    let token = Cookies.get("directorToken");

    $('#helpersubmenu').load('helperDirector.html div#helpersubmenu');
    $('#helpercheifmenu').load('helperDirector.html div#helpercheifmenu');
    
    tableStaffSalary();
    getstaff();
    tableStaffWages();
    
    $('button#resetForm').click(function(){
        location.reload();
    })

    $("form#addStaffForm").submit(function(event){
        event.preventDefault();

        let for_who, quantity, cost;

        for_who = event.target[0].value; 
        quantity = event.target[1].value;
        cost = event.target[2].value;

        let data = {
            quantity: quantity,
            cost: cost,
            for_who: for_who
        }

        data = JSON.stringify(data);
        $.ajax({
            type: 'post',
            url: `http://206.189.145.94/api/v1/staff/salary/percentage/`,
            data: data,
            headers: {
                'Accept':'application/json, text/plain, */*',
                'Content-type': 'application/json',
                'Authorization': `token ${token}`
            }
        })
        .done(function(json){
            location.reload();
        })
        .fail(function(xhr, status, errorThrown){
            infojson = xhr.responseJSON
            infojson = infojson[0];
            
            if (errorThrown == 'Bad Request'){
                alert(infojson)
            }else{
                alert("INternet yo'q");
            }
        })
    })
    
    $("form#takeBiscuitForm").submit(function(event){
        event.preventDefault();

        let biscuitid, biscuit_quantity, staff;

        staff = parseFloat(event.target[0].value);
        biscuit_quantity = parseFloat(event.target[1].value);
        salary = parseFloat(event.target[2].value);
        
        let data = {
            biscuit_quantity: biscuit_quantity,
            staff: staff,
            salary: salary,
            status:"given"
        }

        data = JSON.stringify(data);
        
        $.ajax({
            type: 'post',
            url: `http://206.189.145.94/api/v1/warehouse/staff/salary/detail/`,
            data: data,
            headers: {
                'Authorization': `token ${token}`
            }
        })
        .done(function(json){
            location.reload();
        })
        .fail(function(xhr, status, errorThrown){
            infojson = xhr.responseJSON
            infojson = infojson[0];
            
            if (errorThrown == 'Bad Request'){
                alert(infojson)
            }else{
                alert("INternet yo'q");
            }
        })
    })

    $(document).on("click", "#undoStaffSalary", function(){
        location.reload();
    })

    $(document).on("click", "#editStaffSalary", function(){
        
        $(this).nextAll().eq(0).css("display", "block");
        $(this).nextAll().eq(1).css("display", "block");

        let par = $(this).parent().parent();
        let p = par.children().length - 2;

        for (let i = 2; i < p; i++){
            let elem = par.children(`td:nth-child(${i})`);
            
            if(i == 2){
                elem.html(`<select style='width:100%' class="select2_single" tabindex="1"> 
                    <option value="technological_man">Bosh texnolog</option>
                    <option value="staff">Ishchi</option>
                    <option value="manager">Manager</option>
                </select> `)
            }else{
                elem.html(`<input style='width:100%' type='text' value='${elem.text()}' required/>`)
            }
        }
    })

    $(document).on("click", "#updateStaffSalary", function(){
        let par = $(this).parent().parent();
        let for_who, quantity, cost, elem;
        
        elem = par.children().eq(0);
        id = parseInt(elem.attr("data-id"))

        elem = par.children().eq(1);
        for_who = elem.children().val();
        
        elem = par.children().eq(2);
        quantity = parseFloat(elem.children().val());
        
        elem = par.children().eq(3);
        cost = parseFloat(elem.children().val());
        

        let data = {
            quantity: quantity,
            for_who: for_who,
            cost: cost
        }
        data = JSON.stringify(data);
        console.log(data);
        $.ajax({
            type: 'put',
            url: `http://206.189.145.94/api/v1/staff/salary/percentage/${id}/`,
            data: data,
            headers: {
                'Accept':'application/json, text/plain, */*',
                'Content-type': 'application/json',
                'Authorization': `token ${token}`
            }
        })
        .done(function(json){
            // location.reload();
        })
       .fail(function(xhr, status, errorThrown){
           infojson = xhr.responseJSON
           infojson = infojson[0];
           
           if (errorThrown == 'Bad Request'){
                alert(infojson)
           }else{
                alert("Internet yo'q");
           }
       })
    })

    $(document).on("click", "#undoTakeBiscuit", function(){
        location.reload();
    })

    $(document).on("click", "#editTakeBiscuit", function(){
        
        $(this).nextAll().eq(0).css("display", "block");
        $(this).nextAll().eq(1).css("display", "block");

        let par = $(this).parent().parent();
        let p = par.children().length - 2;

        for (let i = 2; i < p; i++){
            let elem = par.children(`td:nth-child(${i})`);
            
            if(i == 2){
                elem.html(`<select style='width:100%' class="select2_single" tabindex="1" id='staffname'> </select> `)
            }else{
                elem.html(`<input style='width:100%' type='text' value='${elem.text()}' required/>`)
            }
        }
        getstaff();
    })

    $(document).on("click", "#updateTakeBiscuit", function(){
        let par = $(this).parent().parent();
        let for_who, quantity, cost, elem;
        
        elem = par.children().eq(0);
        id = elem.attr("data-id")

        elem = par.children().eq(1);
        staff = elem.children().val();
        
        elem = par.children().eq(2);
        biscuit_quantity = elem.children().val();
        
        elem = par.children().eq(3);
        salary = elem.children().val();
        

        let data = {
            biscuit_quantity: biscuit_quantity,
            staff: staff,
            salary: salary,
            status:"given"
        }
        data = JSON.stringify(data);
        $.ajax({
            type: 'put',
            url: `http://206.189.145.94/api/v1/warehouse/staff/salary/detail/${id}/`,
            data: data,
            headers: {
                'Accept':'application/json, text/plain, */*',
                'Content-type': 'application/json',
                'Authorization': `token ${token}`
            }
        })
        .done(function(json){
            location.reload();
        })
       .fail(function(xhr, status, errorThrown){
           infojson = xhr.responseJSON
           infojson = infojson[0];
           
           if (errorThrown == 'Bad Request'){
                alert(infojson)
           }else{
                alert("Internet yo'q");
           }
       })
    })

    function getstaff(){
        $.ajax({
            type: "GET",
            url: "http://206.189.145.94/api/v1/user/filter/?role=staff",
            headers: {
                'Authorization': `token ${token}`
            },
        })
        .done(function(data){
            let staff = document.querySelectorAll("#staffname");
            count = staff.length - 1;
            console.log(data)
            data.forEach(elem=>{
                    fio = ""
                    element = document.createElement("option");
                    fio = elem.first_name + " " + elem.last_name;
                    element.textContent = fio;
                    element.setAttribute("value", elem.user.id);
                    staff[count].appendChild(element);
                })
            })
        .fail(function(){
            alert("Internet yo'q");
        })
    }  
    
    function tableTakeBiscuit(){
        $.ajax({
            type: 'get',
            url: `http://206.189.145.94/api/v1/warehouse/staff/salary/detail/`,
            headers: {
                'Authorization': `token ${token}`
            }
        })
        .done(function(data){
            let size = 0, output;
            data.forEach(elem=>{
                size++;

                let {quantity, cost, for_who, created_date, id} = elem;
                let createdDate = created_date.slice(0, 10)
                let createdTime = created_date.slice(11, 16)

                let roleName = '';

                if (for_who == 'technological_man'){
                    roleName = 'Bosh Texnolog'
                }else{
                    if(for_who == 'manager'){
                        roleName = 'Manager';
                    }else{
                        if(for_who == 'staff'){
                            roleName = "Ishchi";
                        }
                    }
                }
                output = output + `
                <tr>
                    <th scope="row" id='nameproduct' data-id=${id}>${size}</th>
                    <td>${roleName}</td>
                    <td>${quantity}</td>
                    <td>${cost}</td>
                    <td>${createdDate}</td>
                    <td>${createdTime}</td>
                    <td style="display: flex; flex-direction:row">
                        <p style="font-size:20px; margin-right:5px; cursor:pointer" 
                            data-toggle="tooltip" data-placement="bottom" title="O'zgarish" id="editTakeBiscuit">
                            <i class="fa fa-edit"></i>
                        </p>
                        <p style="font-size: 20px; display: none; margin-right:5px; 
                        cursor:pointer" data-toggle="tooltip" data-placement="bottom" title="Saqlash" id="updateTakeBiscuit">
                            <button type="button" class="btn btn-outline-primary btn-sm">Saqlash</button>
                        </p>
                        <p style="font-size: 20px; margin-right: 5px; cursor:pointer; 
                        display:none" data-toggle="tooltip" data-placement="bottom" title="Qayta yuklash" id="undoTakeBiscuit">
                            <i class="fa fa-undo"></i>
                        </p>
                    </td>
                </tr>
                `
            })
            $('#dataTakeBiscuit').html(output);
        })
    }

    function tableStaffSalary(){
        $.ajax({
            type: 'get',
            url: `http://206.189.145.94/api/v1/staff/salary/percentage/`,
            headers: {
                'Authorization': `token ${token}`
            }
        })
        .done(function(data){
            let size = 0, output;
            data.forEach(elem=>{
                size++;

                let {quantity, cost, for_who, created_date, id} = elem;
                let createdDate = created_date.slice(0, 10)
                let createdTime = created_date.slice(11, 16)

                let roleName = '';

                if (for_who == 'technological_man'){
                    roleName = 'Bosh Texnolog'
                }else{
                    if(for_who == 'manager'){
                        roleName = 'Manager';
                    }else{
                        if(for_who == 'staff'){
                            roleName = "Ishchi";
                        }
                    }
                }
                output = output + `
                <tr>
                    <th scope="row" id='nameproduct' data-id=${id}>${size}</th>
                    <td>${roleName}</td>
                    <td>${quantity}</td>
                    <td>${cost}</td>
                    <td>${createdDate}</td>
                    <td>${createdTime}</td>
                    <td style="display: flex; flex-direction:row">
                        <p style="font-size:20px; margin-right:5px; cursor:pointer" 
                            data-toggle="tooltip" data-placement="bottom" title="O'zgarish" id="editStaffSalary">
                            <i class="fa fa-edit"></i>
                        </p>
                        <p style="font-size: 20px; display: none; margin-right:5px; 
                            cursor:pointer" data-toggle="tooltip" data-placement="bottom" 
                                title="Saqlash" id="updateStaffSalary">
                            <button type="button" class="btn btn-outline-primary btn-sm">Saqlash</button>
                        </p>
                        <p style="font-size: 20px; margin-right: 5px; cursor:pointer; 
                            display:none" data-toggle="tooltip" data-placement="bottom" 
                            title="Qayta yuklash" id="undoStaffSalary">
                            <i class="fa fa-undo"></i>
                        </p>
                    </td>
                </tr>
                `
            })
            $('#dataStaffSalary').html(output);
        })
    }
    
    function tableStaffWages(){
        $.ajax({
            type: 'get',
            url: `http://206.189.145.94/api/v1/staff/technology/salary/`,
            headers: {
                'Authorization': `token ${token}`
            }
        })
        .done(function(data){
            let size = 0, output;
            data.forEach(elem=>{
                size++;

                let {
                    staff:{user:{is_director}}, 
                    staff:{user:{is_accountant}}, 
                    staff:{user:{is_warehouseman}}, 
                    staff:{user:{is_staff}},
                    staff:{user:{is_driver}}, 
                    staff:{user:{is_chief_technological_man}}, 
                    staff:{user:{is_manager}}, 
                    staff:{user:{is_chief_specialist}} ,
                    staff:{user:{phone_number}},
                    staff:{first_name}, 
                    staff:{last_name}, 
                    biscuit_quantity, 
                    salary, 
                    status, 
                    created_date,
                    id
                } = elem;
                
                let createdDate = created_date.slice(0, 10)
                let createdTime = created_date.slice(11, 16)
                let cost = 0;

                if (biscuit_quantity != 0){
                     cost = salary / biscuit_quantity;
                }
                if (status == 'not_given'){
                    status = 'Oylik hali berilmagan'
                }
                let roleName = '';

                if (is_director){
                    role = 'Direktor'
                }else{
                    if (is_accountant){
                        role = 'Ish boshqaruvchi';
                    }else{
                        if (is_warehouseman){
                            role = 'Omborchi';
                        }else{
                            if (is_staff){
                                role = "Ishchi";
                            }else{
                                if (is_driver){
                                    role = "Haydovchi";
                                }else{
                                    if(is_manager){
                                        role = "Sotuvchi manager";
                                    }else{
                                        if (is_chief_technological_man){
                                            role = "Bosh texnolog";
                                        }else{
                                            if (is_chief_specialist){
                                                role = 'Bosh mutaxasis'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                output = output + `
                <tr>
                    <th scope="row" id='nameproduct' data-id=${id}>${size}</th>
                    <td>${last_name}</td>
                    <td>${first_name}</td>
                    <td>${roleName}</td>
                    <td>${phone_number}</td>
                    <td>${biscuit_quantity}</td>
                    <td>${cost}</td>
                    <td>${salary}</td>
                    <td>${status}</td>
                </tr>
                `
            })
            $('#dataStaffWages').html(output);
        })
    }
})