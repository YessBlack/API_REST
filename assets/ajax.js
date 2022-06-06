const $table = document.querySelector('.crud-table')
const $form = document.querySelector('.crud-form')
const $title = document.querySelector('.crud-title')
const $templete = document.getElementById('crud-template').content
const $fragment = document.createDocumentFragment()

const URL_API = "http://localhost:3000/pilares"

const getAll = async() => {
    try{

        let res = await fetch(URL_API)
        json = await res.json()

        //Validar sino existe un error
        //Si la respuesta es falsa lanza al catch
        if(!res.ok) throw {status:res.status,statusText:res.statusText}

        console.log(json)

        json.forEach(el => {   
            $templete.querySelector('.id').textContent = el.id         
            $templete.querySelector(".nombre").textContent = el.nombre
            $templete.querySelector(".pilar").textContent = el.pilar

            let $clone = document.importNode($templete,true)
            $fragment.appendChild($clone)
        })
        $table.querySelector("tbody").appendChild($fragment)
    }catch(err){
        message = err.statusText || "Ocurrio un error"
        $table.insertAdjacentHTML("afterend",`<p><b>Error ${err.status} : ${message}</b></p>`)
    }
}
document.addEventListener('DOMContentLoaded',getAll())

document.addEventListener('submit',async e => {
    if(e.target === $form){
        e.preventDefault()
        console.log(e.target.id.value)
        if(!e.target.id.value){
            //Create POST
            try{
                const options = {
                    method:"POST",
                    headers:{
                        "Content-type":"application/json; charset=utf-8"
                    },
                    body:JSON.stringify({
                        nombre:e.target.nombre.value,
                        pilar:e.target.pilar.value,
                        id:e.target.id.value
                    })
                }
                let res = await fetch(URL_API,options)
                json = await res.json()
                location.reload()

                if(!res.ok) throw {status:res.status,statusText:res.statusText}

            }catch{

                message = err.statusText || "Ocurrio un error"
                $table.insertAdjacentHTML("afterend",`<p><b>Error ${err.status} : ${message}</b></p>`)
            }
        }else{
            //Update PUT
            try {
                const options = {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    },
                    body:JSON.stringify({
                        nombre:e.target.nombre.value,
                        pilar:e.target.pilar.value,
                        id:e.target.id.value
                    })
                }
                const res = await fetch(`http://localhost:3000/pilares/${e.target.id.value}`,options)
                json = await res.json()
                location.reload()
    
                if (!res.ok) throw { status: res.status, statusText: res.statusText };
    
              } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend", `<p><b>Error ${err.status}: ${message}</b></p>`);
              }
        }
    }
})

document.addEventListener("click",async e => {

    if (e.target.matches(".editar")) {
        $title.textContent = "Editar Pilar";
        $form.id.value = e.path[2].cells[0].innerText;
        $form.nombre.value = e.path[2].cells[1].innerText;
        $form.pilar.value =e.path[2].cells[2].innerText;
    }

    if (e.target.matches(".eliminar")) {
        let okEliminar = confirm(`¿Estás seguro de eliminar el id ${e.path[2].cells[0].innerText}?`);

        if(okEliminar){
            try {

                const options = {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json; charset=utf-8"
                    }                               
                }

                const res = await fetch(`http://localhost:3000/pilares/${e.path[2].cells[0].innerText}`,options)
                json = await res.json()
                location.reload()
    
                if (!res.ok) throw { status: res.status, statusText: res.statusText };
    
            }catch (err) {
                let message = err.statusText || "Ocurrió un error";
                alert(`Error ${err.status}: ${message}`);
            }
        }
        
    }
})