/* globals renderQuizzes renderUserBtn */

// //////////////////////////////////////////////////////////////////////////////
// LE MODELE, a.k.a, ETAT GLOBAL
// //////////////////////////////////////////////////////////////////////////////

// un objet global pour encapsuler l'état de l'application
// on pourrait le stocker dans le LocalStorage par exemple
const state = {
    // la clef de l'utilisateur
    xApiKey: '',
    //6193aef4-70d2-465d-a2cf-ea5dd80a1ec4

    // l'URL du serveur où accéder aux données
    serverUrl: 'https://lifap5.univ-lyon1.fr',


    // la liste des quizzes
    quizzes: [],

    //liste des quizzes de user connecter
    mesQuizzes: [],

    //les questionnaires d'un quizze
    questionnaires: [],

    //liste des reponses de user connecter au quizzes
    mesReponses: [],

    // le quizz actuellement choisi
    currentQuizz: undefined,
    //l'etat courant du quizze choisi
    currentQuizzState: undefined,
    //valeur par defaut du nombre de quizz par page , critere de tri et l'ordre de tri
    nombre_quizz_par_page: 50,
    critere_tri_quizz: 'quiz_id',
    ordre_tri: 'asc',
};

// une méthode pour l'objet 'state' qui va générer les headers pour les appel à fetch
const headers = new Headers();
headers.set('X-API-KEY', state.xApiKey);
headers.set('Accept', 'application/json');
headers.set('Content-Type', 'application/json');
state.headers = headers;

// //////////////////////////////////////////////////////////////////////////////
// OUTILS génériques
// //////////////////////////////////////////////////////////////////////////////

// un filtre simple pour récupérer les réponses HTTP qui correspondent à des
// erreurs client (4xx) ou serveur (5xx)
// eslint-disable-next-line no-unused-vars
function filterHttpResponse(response) {
    return response
        .json()
        .then((data) => {
            if (response.status >= 400 && response.status < 600) {
                /*je la ligne suivante en commentaire car ça bloque le navigateur
                 l'orsque la console est ouverte
                 j'ai gerer les erereur d'une autre façon dans le code
                 */
                // throw new Error(`${data.name}: ${data.message}`);
            }

            return data;
        })
        .catch((err) => console.error(`Error on json: ${err}`));
}

// //////////////////////////////////////////////////////////////////////////////
// DONNEES DES UTILISATEURS
// //////////////////////////////////////////////////////////////////////////////

// mise-à-jour asynchrone de l'état avec les informations de l'utilisateur
// l'utilisateur est identifié via sa clef X-API-KEY lue dans l'état
// eslint-disable-next-line no-unused-vars
const getUser = () => {

    const url = `${state.serverUrl}/users/whoami`;
    return fetch(url, {
            method: 'GET',
            headers: state.headers
        })
        .then(filterHttpResponse) //la fonction filterHttpResponse transforme 
        //la reponse http en objet JSON et lance une execption en cas dereur
        .then((data) => {
            // /!\ ICI L'ETAT EST MODIFIE /!\
            state.user = data;
            // on lance le rendu du bouton de login
            return renderUserBtn();
        });
};

// //////////////////////////////////////////////////////////////////////////////
// DONNEES DES QUIZZES
// //////////////////////////////////////////////////////////////////////////////

// mise-à-jour asynchrone de l'état avec les informations de l'utilisateur
// getQuizzes télécharge la page 'p' des quizzes et la met dans l'état
// puis relance le rendu
// eslint-disable-next-line no-unused-vars
/* par defaut les quizzes sont afficher par ordre croissant de quiz_id et 50 quizz par page 
ceci permettra a ne pas creer une autre fonction pour afficher les quizzes selon ces critères*/
const getQuizzes = (p = 1) => {
    console.debug(`@getQuizzes(${p})`);
    //curl -X GET "https://lifap5.univ-lyon1.fr/quizzes/?page=1&limit=10&order=quiz_id&dir=asc"
    const url = `${state.serverUrl}/quizzes/?page=${p}&limit=${state.nombre_quizz_par_page}&
                    order=${state.critere_tri_quizz}&dir=${state.ordre_tri}`;

    // le téléchargement est asynchrone, là màj de l'état et le rendu se fait dans le '.then'
    return fetch(url, {
            method: 'GET',
            headers: state.headers
        })
        .then(filterHttpResponse)
        .then((data) => {
            // /!\ ICI L'ETAT EST MODIFIE /!\
            state.quizzes = data;

            // on a mis à jour les donnés, on peut relancer le rendu
            // eslint-disable-next-line no-use-before-define
            return renderQuizzes();
        });
};

const getUser_Connexion = (calbck) => {

    return fetch(`${state.serverUrl}/users/whoami`, {
            method: 'GET',
            headers: state.headers
        })
        .then(filterHttpResponse)
        .then((data) => {
            state.user = data;
            if (state.user.hasOwnProperty('user_id')) {
                getQuizzes(); //on recupere les quizzesss
                return calbck('OK'); //on change l'etat de la fenetre modale
            } else {
                return calbck('ERREUR')
            }
        }).catch(calbck('ERREUR'));

}
/*cette fonction est utilisée a plusieur android, à chaque fois on veut voir
les quesitonnaires d'un quizz(click quizz, modif quizz ... c'est pourquoi le calback en parametre)
celà permettra d'appeler un rendeur qu'il faut pour chaque appel
*/
function getQuizzeQuestionnaires(url, calback) {

    return fetch(url, {
            method: 'GET',
            headers: state.headers
        })
        .then(filterHttpResponse)
        .then((data) => {
            state.questionnaires = data;
            if (state.questionnaires != null && state.questionnaires != []) {
                //on appel au rendeur qu'il faut
                return calback('OK');
            } else {
                return calback('ERREUR')
            }

        });

}

function envoiReponseQuizzes() {
    //on parcours la liste des questionnaire pour voir la reponse selectionner
    let i = 0;
    let nberreur = 0;
    state.questionnaires.map((chaqueQuestion) => {
        Array.from(document.getElementsByName('quizz_' + i)).map((radios) => {

            if (radios.checked) {

                //construit l'url en fonction de notre choix(proposition), de la question et du quizz q'on veut repondre
                const url = `${state.serverUrl}/quizzes/${state.currentQuizz}/questions/${i}/answers/${radios.value}`;

                return fetch(url, {
                        method: 'POST',
                        headers: state.headers
                    })
                    .then(filterHttpResponse)
                    .then((data) => {
                        console.log(data);
                    })
                    .catch(nberreur++);
            }
        });
        i++; //on passe a la question suivante
    });
    /*vue que y'a beaucoup de reponse a envoyer c'est bourquoi je lance pas l'infobulle dans le .then
    car il se peut que l'envoi d'une des reponses echoue..*/
    if (nberreur === 0)
        avertissement('Une erreur est survenue l\'or d\'envoi de vos reponse\n Veillez contactez l\'administrateur SVP');
    else
        infobulle('Vos Réponses Ont Été Envoyé avec succes', 'green');
}

const getmesQuizzes = () => {

    const url = `${state.serverUrl}/users/quizzes`;
    return fetch(url, {
            method: 'GET',
            headers: state.headers
        })
        .then(filterHttpResponse)
        .then((data) => {

            state.mesQuizzes = data;
            return renderMesQuizzes();
        });


};

//cette fonction retourne les questionnaire d'un quizze au quel le user a repondu
function getQuestionnaireUserReponse(url, dataquiz, rep) {

    return fetch(url, {
            method: 'GET',
            headers: state.headers
        })
        .then(filterHttpResponse)
        .then((questData) => {

            return renderMesReponses(dataquiz, rep, questData);

        });
}

const getmesReponses = () => {

    const url = `${state.serverUrl}/users/answers`;
    return fetch(url, {
            method: 'GET',
            headers: state.headers
        })
        .then(filterHttpResponse)
        .then((data) => {

            state.mesReponses = data;
            state.mesReponses.map((rep) => {

                url2 = `${state.serverUrl}/quizzes/${rep.quiz_id}/`;

                fetch(url2, {
                        method: 'GET',
                        headers: state.headers
                    })
                    .then(filterHttpResponse)
                    .then((dataquiz) => {
                        //ici on le quizze en question
                        const addr = `${state.serverUrl}/quizzes/${rep.quiz_id}/questions/`;
                        return getQuestionnaireUserReponse(addr, dataquiz, rep);
                        //du coup à un instant t on a un quizze , la réponse du user sur ce quizze et les questinnaire du quizze
                    });

            });
        });


};

const envoiQuizze = () => {

    const titre = document.querySelector('#titr_quizze');
    const desc = document.querySelector('#desc_quizze');
    if (titre.value.length < 3)
        infobulle('Le titre doit etre plus 3 caractere');
    else if (desc.value.length < 5)
        infobulle('La description doit etre plus 5 caractere');
    else {
        data = {
            'title': titre.value,
            'description': desc.value
        };
        const body = JSON.stringify(data);
        const url = `${state.serverUrl}/quizzes/`;
        return fetch(url, {
                method: 'POST',
                headers: state.headers,
                body
            })
            .then(filterHttpResponse)
            .then((retour) => {
                //declenche l'action associer au button mesQuizzes pour mettre a jour la liste des quizzes
                document.querySelector('#id-mesquizzes').click();
                titre.value = '';
                desc.value = '';
                return infobulle('Quizze créer avec succes! ', 'green');

            });
    }
};

const ajouteQuestion = (url, body, calback) => {

    fetch(url, {
            method: 'POST',
            headers: state.headers,
            body
        })
        .then(filterHttpResponse)
        .then((reponse) => {
            //on sait que si la reponse est bonne alors y'aura un attribut question_id
            if (reponse.hasOwnProperty('question_id')) {
                return calback('OK');
            } else {
                return calback('ERREUR')
            }
        });
};
/* cette methode va servir de modifier un quizz, la sentence d'une question et ces proposition*/
const modificationQuizz = (url, body, calback) => {

    fetch(url, {
            method: 'PUT',
            headers: state.headers,
            body
        })
        .then(filterHttpResponse)
        .then((reponse) => {
            //on sait que si la reponse est bonne alors y'aura un attribut quiz_id retourné
            if (reponse.hasOwnProperty('quiz_id')) {
                return calback('OK');
            } else {
                return calback('ERREUR')
            }
        });
};
const supQuestionQuizz = (url, calback) => {

    fetch(url, {
            method: 'DELETE',
            headers: state.headers
        })
        .then(filterHttpResponse)
        .then((reponse) => {
            //on sait que si la reponse est bonne alors y'aura un attribut quiz_id retourné
            if (reponse.hasOwnProperty('quiz_id')) {
                return calback('OK');
            } else {
                return calback('ERREUR')
            }
        });
};
const getRepondantQuestQuizz = (url, calback) => {

    fetch(url, {
            method: 'GET',
            headers: state.headers
        })
        .then(filterHttpResponse)
        .then((data) => {
            //on sait que si la reponse est bonne alors y'aura un attribut quiz_id retourné
            if (data.hasOwnProperty('quiz_id')) {
                return calback('OK', data);
            } else {
                return calback('ERREUR')
            }
        });
};