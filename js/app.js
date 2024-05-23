console.log("El archivo está importado");
const urlApi = "https://spotify-d0ea.restdb.io/rest/playlists?apikey=652810d196c2501ea9e3ed3b";

appCanciones = {
    listarCancion: ()=>{
      //tomamos la referencia del contenedor donde se mostarran los cancions
      const contenedor=document.getElementById("contenedorCanciones");

      //creamos una variable vacia que contendrá todo el codigo HTML que vamos a insertar
      let contenidoHTML = "";

      fetch(urlApi).then(respuesta=>respuesta.json()).then(canciones=>{
          console.log(canciones);

          for (const cancion of canciones) {
              contenidoHTML += `
              <div class="canciones">
                  <img src="${cancion.portada_url}" class="img thumbnail"/>
                  <h4>${cancion.cancion}</h4>
                  Artista(s): ${cancion.artista}<br>
                  <button class="btn btn-primary-eliminar"><a id="eliminar" href="#" onclick="appCanciones.eliminarCancion('${cancion._id}','${cancion.cancion}')">Eliminar</a></button>
                  <button class="btn btn-primary-editar"><a href="#" onclick="appCanciones.editarCancion('${cancion._id}')"><img id="editar" src="../imgs/lapiz.png"></a></button>
              </div>
              `;
          };
          contenedor.innerHTML=contenidoHTML;
      })
    },
    eliminarCancion: (idAEliminar,nombreABorrar)=>{
      Swal.fire({
          title: `Estás seguro que desea borrar la cancion "${nombreABorrar}"`,
          text: "No podrás revertir esta operación",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Si, quiero borrarlo!'
        }).then((result) => {
          if (result.isConfirmed) {
              const urlApi=`https://spotify-d0ea.restdb.io/rest/playlists/${idAEliminar}?apikey=652810d196c2501ea9e3ed3b`;
          fetch(urlApi, {
            method: 'DELETE'
            })
            .then(response => {
              console.log(response);
              return appCanciones.listarCancion();
            }).then(response =>{
              Swal.fire(
                'Eliminado!',
                `La cancion "${nombreABorrar}" fue borrada.`
              )
            });
            }
        })
  },
    guardarCancion: ()=>{
      const txtId=document.getElementById("txtId");
      const txtCancion=document.getElementById("txtCancion");
      const txtArtista=document.getElementById("txtArtista");
      const txtPortada=document.getElementById("txtPortada");
      let urlApi='';
      let metodoHttp='';
      if(txtId.value==''){
          urlApi="https://spotify-d0ea.restdb.io/rest/playlists?apikey=652810d196c2501ea9e3ed3b";
          metodoHttp='POST';
      }else{
          urlApi=`https://spotify-d0ea.restdb.io/rest/playlists/${txtId.value}?apikey=652810d196c2501ea9e3ed3b`;
          metodoHttp='PUT';
      }

      const cancionAGuardar = {
          "cancion": txtCancion.value,
          "artista": txtArtista.value,
          "portada_url": txtPortada.value,
      };
      console.log(cancionAGuardar);

      fetch(urlApi, {
          method: metodoHttp,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(cancionAGuardar)
          })  
          .then(response => {
            console.log(response);
            window.location.href="index.html";
          });
  },
  editarCancion:(idCancionAEditar)=>{
    const urlApi=`https://spotify-d0ea.restdb.io/rest/playlists/${idCancionAEditar}?apikey=652810d196c2501ea9e3ed3b`;
    fetch(urlApi
        ).then(res => res.json())
          .then(cancion => {
            document.getElementById("txtId").value=cancion._id;
            document.getElementById("txtCancion").value=cancion.cancion;
            document.getElementById("txtArtista").value=cancion.artista;
            document.getElementById("txtPortada").value=cancion.portada_url;

            const ventanaEditar=document.getElementById("agregarEditarModal");
            let ventana = new bootstrap.Modal(ventanaEditar);
            ventana.show();
          });
}
}
appCanciones.listarCancion();