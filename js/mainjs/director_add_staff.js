    
$(document).ready(function(){   

    let mycookie = Cookies.get("director");
    if (mycookie == "false" || mycookie == undefined){
        window.open("index.html", "_self");
    }

    let token = Cookies.get('directorToken');


    $('#helpersubmenu').load('helperDirector.html div#helpersubmenu');
    $('#helpercheifmenu').load('helperDirector.html div#helpercheifmenu');

    $('form').submit(function(event) {
        event.preventDefault();
        let listinput = [], fname, lname, address, phonenumber, pass, pass1, role, roleName;

        listinput = event.target.querySelectorAll('input');
        fname = listinput[0].value;
        lname = listinput[1].value;
        address = listinput[2].value;
        phonenumber = listinput[3].value;
        pass = listinput[4].value;
        pass1 = listinput[5].value;
        role = event.target.querySelectorAll('select')[0];
        roleName = String(role.options[role.selectedIndex].value);

        if (pass === pass1){
            let data = {
                phone_number:        phonenumber, 
                password:            pass, 
                role:                roleName, 
                first_name:          fname, 
                last_name:           lname, 
                address:             address,
                csrfmiddlewaretoken: window.CSRF_TOKEN
            };

            $.ajax({
                type: "POST",
                url: 'http://206.189.145.94/api/v1/user/register/',
                data: data,
                headers: {
                    "Authorization": `token ${token}`
                },
            })
            .done(function(data){
                alert("Muvaffaqiyatli saqlandi!!!");
                console.log(data);
            })
            .fail(function(response) {
                alert("Internet yo'q")
            })
        }else{
            alert("Birinchi parol va ikkinchi parol teng bo'lishi kerak");
        }
    })

    $('#search').keyup(function(){
        let count = 0;
        search_table($(this).val(), count)
    })

    function search_table(value, count){
        $('#client_table tbody tr').each(function(){
            let found = false;
            $(this).each(function(){
                if ($(this).text().toLowerCase().indexOf(value.toLowerCase()) >= 0){
                    found = true;
                    count++;
                }
            })
            if (found){
                $(this).show();
                $('#counter').html(count + ' ta topildi');
            }else{
                $(this).hide();
                $('#counter').html(count + ' ta topildi');
            }
        })
    }
    
    warehouseStaffList();

    function warehouseStaffList(){
        $.ajax({
            url: 'http://206.189.145.94/api/v1/user/account/list/',
            type: 'get',
            headers:{
                'Authorization': `Token ${token}`
            },
        }).done(function(data){
            let output = "", size = 1, role = "";

            data.forEach(elem=>{
                size++;
                let {
                    user:{phone_number}, 
                    // user:{date_joined},
                    user:{is_director},
                    user:{is_accountant},
                    user:{is_warehouseman},
                    user:{is_staff},
                    user:{is_driver},
                    user:{is_manager},
                    user:{is_chief_technological_man},
                    user:{is_chief_specialist},
                    first_name, 
                    last_name, 
                    address
                } = elem;

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

                // created_date = date_joined.slice(0, 10);
                // modified_time = date_joined.slice(11, 16);

                output += `
                <tr>
                <th scope="row">${size}</th>
                <td id="nameproduct">${first_name}</td>
                <td>${last_name}</td>
                <td>${role}</td>
                <td>${address}</td>
                <td>${phone_number}</td>
                
            </tr>
            `    
        })
        $('#dynamicTable').html(output);

        }).fail(function(){
            alert("Internet yo'q")
        })
        
    }
})
