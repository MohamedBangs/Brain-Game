/* global M getUser getQuizzes state filterHttpResponse installWebSocket */

// un simple ping/pong, pour montrer comment on envoie des données JSON au serveur
// eslint-disable-next-line no-unused-vars
const postEcho = (data) => {
    const url = `${state.serverUrl}/echo`;
    const body = JSON.stringify(data);
    return fetch(url, {
            method: 'POST',
            headers: state.headers,
            body
        })
        .then(filterHttpResponse)
        .catch(console.error);
};

// //////////////////////////////////////////////////////////////////////////////
// PROGRAMME PRINCIPAL
// //////////////////////////////////////////////////////////////////////////////

function app() {
    console.debug(`@app()`);
    // ici, on lance en parallèle plusieurs actions
    if (state.xApiKey === '' || state.xApiKey === null) {
        connexionSansAPI();
    } else {
        return Promise.all([getUser(), getQuizzes()]).then(() =>
            console.debug(`@app(): OK`)
        );
    }
}

(function() {
    //listener sur l'item mes quizzes
    document.querySelector('#id-mesquizzes').addEventListener('click', function() {
        getmesQuizzes();
        document.querySelector('#btn_creer_quizze').addEventListener('click', function() {
            envoiQuizze();
        }, false);
    }, false);
    //listener sur l'item mes reponses
    document.querySelector('#id-mesreponses').addEventListener('click', function() {
        document.querySelector('#id-mes-reponses-quiz').innerHTML = '';
        getmesReponses();
    }, false);
    //listener sur le nombre de quizzes à afficher par page
    document.querySelector('#select_nombre_quizz').addEventListener('change', function() {
        state.nombre_quizz_par_page = this.options[this.selectedIndex].value;
        getQuizzes();
    }, false);
    //listener sur le critère de tri
    document.querySelector('#select_critere_tri_quizz').addEventListener('change', function() {
        state.critere_tri_quizz = this.options[this.selectedIndex].value;
        getQuizzes();
    }, false);
    //listener sur le l'ordre du tri
    document.querySelector('#select_ordreTri_quizz').addEventListener('change', function() {
        state.ordre_tri = this.options[this.selectedIndex].value;
        getQuizzes();
    }, false);
})();

// pour initialiser la bibliothèque Materialize
// https://materializecss.com/auto-init.html
M.AutoInit();

// lancement de l'application
app();

// pour installer le websocket
// sendMessage = installWebSocket(console.log);