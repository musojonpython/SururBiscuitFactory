$(document).ready(function(){
    
    mycookie = Cookies.get("director");

    if (mycookie == "false" || mycookie == undefined){
        window.open('index.html', "_self");
    }
    let token = Cookies.get("directorToken");

    $('#helpersubmenu').load('helperDirector.html div#helpersubmenu');
    $('#helpercheifmenu').load('helperDirector.html div#helpercheifmenu');
    
    tableStaffWages();
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
                roleName = "Bosh texnolog"
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