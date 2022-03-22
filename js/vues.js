/* global state getQuizzes */

// //////////////////////////////////////////////////////////////////////////////
// HTML : fonctions génération de HTML à partir des données passées en paramètre
// //////////////////////////////////////////////////////////////////////////////

// génération d'une liste de quizzes avec deux boutons en bas
const htmlQuizzesList = (quizzes, curr, total) => {

    // un élement <li></li> pour chaque quizz. Noter qu'on fixe une donnée
    // data-quizzid qui sera accessible en JS via element.dataset.quizzid.
    // On définit aussi .modal-trigger et data-target="id-modal-quizz-menu"
    // pour qu'une fenêtre modale soit affichée quand on clique dessus
    // VOIR https://materializecss.com/modals.html
    const quizzesLIst = quizzes.map(
        (q) =>
        `<li class="collection-item modal-trigger cyan lighten-5" data-target="id-modal-quizz-menu" data-quizzid="${q.quiz_id}">
        <h5 id="titr${q.quiz_id}">${q.title}</h5>
        <span id="desc${q.quiz_id}">${q.description}</span>
        <a id="own${q.quiz_id}" class="chip">${q.owner_id}</a>
        <span id="dte${q.quiz_id}" style="display:none">${q.created_at}</span>
        <input id="etat${q.quiz_id}" value="${q.open}" style="display:none" />
      </li>`
    );
    // le bouton "<" pour revenir à la page précédente, ou rien si c'est la première page
    // on fixe une donnée data-page pour savoir où aller via JS via element.dataset.page
    const prevBtn =
        curr !== 1 ?
        `<li class="waves-effect" id="id-prev-quizzes" data-page="${curr -
          1}" ><a href="#!"><i class="material-icons">chevron_left</i></a></li>` :
        '<li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>';

    // le bouton ">" pour aller à la page suivante, ou rien si c'est la derniere page
    const nextBtn =
        curr !== total ?
        `<li class="waves-effect" id="id-next-quizzes" data-page="${curr +
          1}" ><a href="#!"><i class="material-icons">chevron_right</i></a></li>` :
        '<li class="disabled><a href="#!"><i class="material-icons">chevron_right</i></a></li>';
    //la pagination ici(de 1 à total)
    let numbers_pagination = '';
    for (let page = 1; page <= total; page++) {
        page !== curr ?
            numbers_pagination += `<li class="waves-effect" data-page="${page}"><a href="#!">${page}</a></li>` :
            numbers_pagination += `<li class="active"><a href="#!">${page}</a></li>`;
    }
    // La liste complète les deux boutons en bas et les nombres pour la pagination
    const html = `
  <ul class="collection">
    ${quizzesLIst.join('')}
  </ul>
  <div class="row">  
    <ul class="pagination" id="id_content_numeros_pages">    
        ${prevBtn}
        ${numbers_pagination}
        ${nextBtn}
    </ul>    
  </div>
  `;
    return html;
};

const htmlQuizzesQuestionnaireList = (idquest, nbProposition, listPropostion) => {

    /* l'attribut class=propquizze permettra de recupere tous les propostions d'un quizze et envoyé 
    celle qui ont eté cocher l'attribut value permetra de recuperer l'id de la question et de la proposition*/
    const prpsition = listPropostion.map(
        (q) => `
                      <label>
                        <input name="quizz_${idquest}" class="propquizze" type="radio" value="${q.proposition_id}" />
                        <span>${q.content}</span>
                      </label>
                    `
    );
    return prpsition.join('');

};

const htmlQuestionModifList = (idquest, listPropostion) => {

    const prpsition = listPropostion.map(
        (q) => `
                      <label>
                        <div class="input-field col l10">
                            <input id="quizz_${q.proposition_id}_${idquest}" class="modif_propquizze" type="text" value="${q.content}" />
                        </div>    
                        <div class="input-field col l2">
                             <label> <input name="modif_proposition${idquest}" class="modif_proposition" type="radio" id="modif_${q.proposition_id}_${idquest}" /> <span></span> </label>
                        </div>
                      </label>
                    `
    );
    return prpsition.join('');

};

const htmlMesQuizzesList = (lstMesQuiz) => {

    const quizzesList = lstMesQuiz.map(
        (q) =>
        `<li class="collection-item modal-trigger cyan lighten-5" style="height:auto;" data-target="id-modal-quizz-menu" data-quizzid="${q.quiz_id}">
        <h5 id="titr${q.quiz_id}">${q.title}</h5>
        <span id="desc${q.quiz_id}">${q.description}</span>
        <br /><span id="dte${q.quiz_id}">${q.created_at}</span><br />
        <span id="nbrquest${q.quiz_id}" style="display:none">${q.questions_number}</span>
        <div id="modif${q.quiz_id}" class="modifQuestion" >Modifier <i class="material-icons">border_color</i></div>
        <label class="listeRepondant" id="list_repondant${q.quiz_id}">Répondants</label>
        <div id="ajoutQuest${q.quiz_id}" class="ajoutQuest"> Questions <i class="material-icons">add</i></div>
      </li>`
    );
    // La liste complète et les deux boutons en bas
    const html = `
  <ul class="collection">
    ${quizzesList.join('')}
  </ul>`
    return html;
};

const htmlQuizzesReponseuser = (idquest, listPropostion, quizId) => {

    //${q.proposition_id}_${idquest}_${quizId}: de chaque proposition va me permetre de colorer la reponse du user
    const prpsition = listPropostion.map(
        (q) => {
            return ` <label class="reponse-quizz-user">
                                  <span id="propstion${q.proposition_id}_${idquest}_${quizId}">${q.content}</span>
                                </label>
                               `
        });
    return prpsition.join('');

};
const htmlListPropostionReponseNote = (listPropostion) => {

    const prpsition = listPropostion.map(
        (q) => {
            return ` <label class="reponse-quizz-user">
                                  <span>${q.content}</span>
                                </label>
                               `
        });
    return prpsition.join(' , ');

};

function htmlMesReponseList(dataquiz, questionnaire, calback) {
    const idQuestion = [];
    const htmlprop = questionnaire.map((quest) => {

        let undiv = `<h6 class="sentnce">${quest.sentence}</h6>`;
        undiv += htmlQuizzesReponseuser(quest.question_id, quest.propositions, dataquiz.quiz_id);
        idQuestion.push(quest.question_id);
        return undiv;
    });
    const html = `  <div class="unquizz">
                      <div> 
                        <h4>${dataquiz.title}</h4>
                        <p>
                            ${dataquiz.created_at} 
                            par ${dataquiz.owner_id}
                        </p>
                        <p>${dataquiz.description}</p>
                      </div>
                    <div>
                      <div>
                           <ul>
                            ${htmlprop.join('')}
                            </ul>
                   </div>
                </div>`
    calback(html, idQuestion);

}

// //////////////////////////////////////////////////////////////////////////////
// RENDUS : mise en place du HTML dans le DOM et association des événemets
// //////////////////////////////////////////////////////////////////////////////

// met la liste HTML dans le DOM et associe les handlers aux événements
// eslint-disable-next-line no-unused-vars
function renderQuizzes() {

    // les éléments à mettre à jour : le conteneur pour la liste des quizz
    const usersElt = document.getElementById('id-all-quizzes-list');
    // une fenêtre modale définie dans le HTML
    //const modal = document.getElementById('id-modal-quizz-menu');

    // on appelle la fonction de généraion et on met le HTML produit dans le DOM
    usersElt.innerHTML = htmlQuizzesList(
        state.quizzes.results,
        state.quizzes.currentPage,
        state.quizzes.nbPages
    );

    // /!\ il faut que l'affectation usersElt.innerHTML = ... ait eu lieu pour
    // la liste de tous les quizzes individuels
    const quizzes = document.querySelectorAll('#id-all-quizzes-list li');
    //les pages(pagination)
    const numeroPage = document.querySelectorAll('#id_content_numeros_pages li');

    // les handlers quand on clique sur "<" ou ">"
    function clickBtnPager() {
        // remet à jour les données de state en demandant la page
        // identifiée dans l'attribut data-page
        // noter ici le 'this' QUI FAIT AUTOMATIQUEMENT REFERENCE
        // A L'ELEMENT AUQUEL ON ATTACHE CE HANDLER
        /*On verifi s'il l'element contient l'attribut data-page pour eviter d'envoyer 
        une requete avec numero de la page undefined car les fleches < et > n'ont pas cette attribut
        l'orsqu'on arrive a la fin ou quand on est en debut de page*/
        if (this.hasAttribute('data-page'))
            getQuizzes(this.dataset.page);
    }
    // quand on clique sur un quizz, on change sont contenu avant affichage
    // l'affichage sera automatiquement déclenché par materializecss car on
    // a définit .modal-trigger et data-target="id-modal-quizz-menu" dans le HTML
    function clickQuiz() {
        const quizzId = this.dataset.quizzid;
        const addr = `${state.serverUrl}/quizzes/${quizzId}/questions/`;

        state.currentQuizz = quizzId;
        state.currentQuizzState = document.querySelector('#etat' + quizzId).value;
        getQuizzeQuestionnaires(addr, (reponse) => {
            if (reponse == 'OK')
                renderCurrentQuizz();
            else infobulle('Une erreur est survenu l\'ors de la récuperation des questionnaires\n Veillez contacter l\'administrateur', 'red');
        }); // recupere les questionnaires
        //on remonte en haut de la page pour voir le debut du quizze
        window.scrollTo(0, 0);
    }

    // pour chaque quizz, on lui associe son handler
    quizzes.forEach((q) => {
        q.onclick = clickQuiz; //on associe la fonction clikQuiz a tous les quiz
    });
    //pour chaque numero de quizz et les fleches < >, on associe son handler
    numeroPage.forEach((pg) => {
        pg.onclick = clickBtnPager;
    });
}

function renderCurrentQuizz() {

    const main = document.getElementById('id-all-quizzes-main');
    const html = state.questionnaires.map((quest) => {
        let undiv = `<h6 class="sentnce">${quest.sentence}</h6>`;
        undiv += htmlQuizzesQuestionnaireList(quest.question_id, quest.propositions_number,
            quest.propositions);
        return undiv;
    });

    main.innerHTML = `<div class="unquizz">
                      <div> 
                        <h4>${document.querySelector('#titr'+state.currentQuizz).innerHTML}</h4>
                        <p>
                            ${document.querySelector('#dte'+state.currentQuizz).innerHTML} 
                            par ${document.querySelector('#own'+state.currentQuizz).innerHTML}
                        </p>
                        <p>${document.querySelector('#desc'+state.currentQuizz).innerHTML}</p>
                      </div>
                    <div>
                      <div>

                    ${html.join('')}
                     <br /><br />
                     ${possibiliteEnvoie()}
                </div>
             </div>`
}
//si le quizz est ouvert y'a possibilité d'envoyer la reponse si non on block
function possibiliteEnvoie() {
    if (state.currentQuizzState === 'true')
        return `<button type="button" class="btn waves-effect waves-light" onclick="envoiReponseQuizzes()">
               Répondre <i class="material-icons right">send</i></button>`;
    else
        return `<button type="button" class="qcmferme waves-effect waves-light">
               QCM Fermé <i class="material-icons right">block</i></button>`;
}

// quand on clique sur le bouton de login, il nous dit qui on est
// eslint-disable-next-line no-unused-vars
const renderUserBtn = () => {
    const btn = document.getElementById('id-login');
    btn.onclick = () => {

        const xkey = document.querySelector('#idapikey_userConnecte');
        const bttn = document.querySelector('#bttn_connex_deconnex');
        const overlay = document.querySelector('#oveer-lay');
        const nom = document.querySelector('#idlstename_userConnecte');
        const prenom = document.querySelector('#idfirsname_userConnecte');
        const identif = document.querySelector('#identif_userConnecte');
        const avertissement = document.querySelector('#etatConnexion');
        const deconnecte = document.querySelector('#bttn_deconnex');
        if (state.user) {

            nom.value = state.user.lastname.toUpperCase();
            prenom.value = state.user.firstname;
            identif.value = state.user.user_id;
            xkey.value = state.xApiKey;
            //on change connexion en modifier car le user est deja connecté
            bttn.value = 'modifier';
            //on active le boutton deconnexion
            deconnecte.disabled = false;
            deconnecte.addEventListener('click', function() {
                //le user est connecté et veut se deconnecté
                state.xApiKey = '';
                state.headers.set('X-API-KEY', state.xApiKey);
                nom.value = '';
                prenom.value = '';
                identif.value = '';
                xkey.value = '';
                //on recharge la page sans l'utilisation de cache
                document.location.reload(true);
            }, false);
        }
        //on affiche la fenetre modale pour s'authentifier ou modifier sa clé de connexion
        overlay.style.display = 'block';
        bttn.parentNode.style.display = 'block';

        document.querySelector('#btn_chnge_api').addEventListener('click', function() {
            xkey.disabled = false;
            bttn.disabled = false;

        }, false);

        bttn.addEventListener('click', function() {
            //ici j'ai voulu mettre une contraite sur la taille de(xkey.lenght) mais 
            //dans le sujet aucune indication n'a été donnée pour la taille de la clé api
            if (xkey.value === '' || xkey.value === null) {
                avertissement.innerHTML = 'Le champs API Clé ne peux pas être vide';
                avertissement.style.display = 'block';
            } else {
                //on met a jour les nouvelles informations
                state.xApiKey = xkey.value;
                state.headers.set('X-API-KEY', state.xApiKey);
                getUser_Connexion((reponse) => {
                    if (reponse === 'OK') {
                        nom.value = state.user.lastname.toUpperCase();
                        prenom.value = state.user.firstname;
                        identif.value = state.user.user_id;
                        xkey.disabled = true;
                        this.disabled = true;
                        avertissement.innerHTML = '';
                        avertissement.style.display = 'none';
                        const btncancel = document.querySelector('#btn_cancel');
                        btncancel.style.display = 'block';
                        btncancel.click();
                    } else {
                        avertissement.innerHTML = 'Votre clé API est invalide';
                        avertissement.style.display = 'block';
                    }
                });
            }

        }, false);

        document.querySelector('#btn_cancel').addEventListener('click', function() {
            this.parentNode.style.display = 'none';
            overlay.style.display = 'none';
        }, false);
    };
};

function connexionSansAPI() {
    renderUserBtn();
    const avertissement = document.querySelector('#etatConnexion');
    avertissement.innerHTML = 'Vous devez donnez votre clé API pour continuer';
    avertissement.style.display = 'block';
    document.querySelector('#id-login').click();
    document.querySelector('#btn_cancel').style.display = 'none';
}

function renderMesQuizzes() {
    // les éléments à mettre à jour : le conteneur pour la liste des quizz de user
    const usersElt = document.querySelector('#id-mes-quizzes-list');
    // on appelle la fonction de généraion et on met le HTML produit dans le DOM
    usersElt.innerHTML = htmlMesQuizzesList(state.mesQuizzes);
    // pour chaque button 'Question+', on lui associe son handler
    Array.from(document.querySelectorAll('#id-mes-quizzes-list li .ajoutQuest')).map((element) => {

        element.onclick = cliqueAjoutQuestion;
    });

    // pour chaque button 'modifQuestion', on lui associe son handler
    Array.from(document.querySelectorAll('#id-mes-quizzes-list li .modifQuestion')).map((element) => {

        element.onclick = cliqueModifQuizz;
    });
    //pour chaque label 'listeRepondant', on lui associe son handler
    Array.from(document.querySelectorAll('#id-mes-quizzes-list li .listeRepondant')).map((element) => {

        element.onclick = cliqueListeRepondant;
    });
}

function cliqueListeRepondant() {
    //recupere l'id de son parent (qui est l'id du quizze en question)
    const quizzId = this.parentNode.dataset.quizzid;
    //on cache le formulaire de supresion quizz s'il est afficher
    document.querySelector('#div_modif_Quizz').style.display = 'none';
    //on cache le formualaire d'ajout questionn s'il est afficher
    document.querySelector('#div_Ajoute_Question').style.display = 'none';
    //on cache le formulaire ajout quizze
    document.querySelector('#div_creer_cmpte').style.display = 'none';
    //on vide la liste des répondant du précedent quiz cliqué
    document.querySelector('#repondant_tab_body').innerHTML = '';
    //on affiche le quizz dans le content
    document.querySelector('#note_titr_quizze').innerHTML = document.querySelector('#titr' + quizzId).innerHTML;
    document.querySelector('#note_desc_quizze').innerHTML = document.querySelector('#desc' + quizzId).innerHTML;
    //on affiche le div contenant la liste et infos du quizz cliqué
    document.querySelector('#div_note_quizz').style.display = 'block';
    //on ajoute cet evenement au cas ou l'utilisateur veut retourner au formulaire <<creer quizze>>
    document.querySelector('#btn_retour_list_repondant').addEventListener('click', function() {
        //on cache le div liste des repondants
        document.querySelector('#div_note_quizz').style.display = 'none';
        //on affiche le formulaire ajout quizze
        document.querySelector('#div_creer_cmpte').style.display = 'block';
    }, false);
    //contient la liste des propositon(html)
    let div_liste_proposition = '';
    const urlRepondantQuizzQuestion = `${state.serverUrl}/quizzes/${quizzId}/questions/`;
    getQuizzeQuestionnaires(urlRepondantQuizzQuestion, (reponse) => {
        if (reponse == 'OK') {
            //on recupere les repondant de chaque question
            state.questionnaires.map((quest) => {
                div_liste_proposition += `<h6 class="sentnce">${quest.sentence}</h6>`;
                div_liste_proposition += htmlListPropostionReponseNote(quest.propositions);
                const urlQuestRpondant = `${state.serverUrl}/quizzes/${quizzId}/questions/${quest.question_id}/answers/`;
                /*la fonction getRepondantQuestQuizz prends une fonction de calback 
                avec deux parametre: reponse: pour indiquer si la requete c'est bien passée
                et data contient la liste des repondants a une question*/
                getRepondantQuestQuizz(urlQuestRpondant, (reponse, repondant = []) => {
                    //si la requette a echoué on arrete et affiche un message d'erreur
                    if (reponse === 'ERREUR') {
                        infobulle('Une erreur est survenu l\'ors de la récuperation des répondants\n Veillez contacter l\'administrateur', 'red');
                    } else {
                        //les propositions de cette question
                        repondant.propositions.map((p) => {
                            //les repondants de cette proposition
                            p.answers.map((a) => rendererNoteRepondant(a.user_id, p.correct ? 1 : 0));
                        });
                    }
                });
            });
            //on affiche les questions et propositions du quizze
            document.querySelector('#note_content_proposition').innerHTML = div_liste_proposition;
        } else
            infobulle('Une erreur est survenu l\'ors de la récuperation des questionnaires\n Veillez contacter l\'administrateur', 'red');
    });

    function rendererNoteRepondant(idUser, note) {
        let user = undefined;
        let uneLigneTableau = document.createElement('tr');
        const nbrquest = document.querySelector('#nbrquest' + quizzId).innerHTML;
        //si l'utilisateur n'existe pas, on lui rajoute dans la page
        if (document.querySelector('#note_' + idUser) == undefined) {
            const progress_value = (1 * 100) / nbrquest;
            uneLigneTableau.innerHTML = `<td>${idUser}</td>
                                          <td id="note_${idUser}">${note}/${nbrquest}</td>
                                          <td>
                                                <progress id="nbrQ_${idUser}" class="rpndu_1" max="100" value="${progress_value}"> ${progress_value}% </progress> 
                                         </td>`;
            document.querySelector('#repondant_tab_body').appendChild(uneLigneTableau);
        } else {
            //l'utilisateur existe deja on change sa note et augmente le nombre de question au quel il a repondu
            const tdNoteUser = document.querySelector('#note_' + idUser);
            const progress = document.querySelector('#nbrQ_' + idUser);
            //on recupere le nombre de question repondu par le user avant.
            let nbrQuestionRepondu = Number(progress.getAttribute('class').substring(progress.getAttribute('class').indexOf('_') + 1));
            //on incremente pour cette question car il l'a repondu
            nbrQuestionRepondu++;
            progress.setAttribute('class', 'rpndu_' + nbrQuestionRepondu);

            if (note !== 0) //si la note est zéro, on fait pas le calcul
                tdNoteUser.innerHTML = (Number(tdNoteUser.innerHTML.substring(0, tdNoteUser.innerHTML.indexOf('/'))) + note) + '/' + nbrquest;
            //on met a jour la barre de progression
            const progress_value = (nbrQuestionRepondu * 100) / nbrquest;
            progress.value = progress_value;
            progress.innerHTML = progress.value + '%';
        }
    }
    //on remonte en haut
    scrollTo(0,0);
}

function cliqueAjoutQuestion() {

    //recupere l'id de son parent (qui est l'id du quizze en question)
    const quizzId = this.parentNode.dataset.quizzid;
    //on cache le formulaire de supresion quizz s'il est afficher
    document.querySelector('#div_modif_Quizz').style.display = 'none';
    //on cache le formulaire ajout quizze
    document.querySelector('#div_creer_cmpte').style.display = 'none';
    //on cache le div pour affichage des repondants d'un quiz
    document.querySelector('#div_note_quizz').style.display = 'none';
    //on affiche le quizze en question dans le formulaire
    document.querySelector('#question_titr_quizze').innerHTML = document.querySelector('#titr' + quizzId).innerHTML;
    document.querySelector('#question_desc_quizze').innerHTML = document.querySelector('#desc' + quizzId).innerHTML;
    //on vide les propositions ajoutées dynamiquement l'ors du précedent click
    document.querySelector('#container_pro_quizz_dynamique').innerHTML = '';
    //on vide le formulaire d'ajout question et proposition
    document.querySelector('#question_quizze').value = '';
    document.querySelector('#pro1_quizze').value = '';
    document.querySelector('#pro2_quizze').value = '';

    //par defaut y'a deux propositions par quizze
    let propostionsuivante = 3;
    /*on ajoute le button envoyer questionnaire pour ce quizz au formulaire dans index.html
    Note:j'aurai pu ajouter un seul button dans le formulaire, mais celà declecherai l'envoi de 
    questionnaire pour tous les prècedents click car sa serait le même button pour le click i et 
    le click i+1
    */
    const contentBtnEvoyer = document.querySelector('#content_envoyer_questionnaire');
    contentBtnEvoyer.innerHTML = `
                <div class="col l4">
                  <button class="btn waves-effect waves-light" type="button" id="id_creer_question_${quizzId}">Créer
                      <i class="material-icons right">send</i>
                  </button>
                </div>`;
    const contentAjoutPropo = document.querySelector('#content_ajout_propostion');
    //on ajoute cet evenement au cas ou l'utilisateur veut retourner au formulaire <<creer quizze>>
    document.querySelector('#btn_retour_creer_quizz').addEventListener('click', function() {
        //on cache le formulaire ajout question
        div_Ajoute_Question.style.display = 'none';
        //on affiche le formulaire ajout quizze
        document.querySelector('#div_creer_cmpte').style.display = 'block';
    }, false);

    contentAjoutPropo.innerHTML = `
                   <div class="ajt_propositon col l8" id="btn_ajout_proposit_${quizzId}">
                      <label class="waves-effect waves-light">Ajouter proposition
                          <i class="material-icons right">add</i>
                      </label>
                    </div>`;
    const div_Ajoute_Question = document.querySelector('#div_Ajoute_Question');
    div_Ajoute_Question.style.display = 'block'; //on affiche le formulaire pour l'ajout questionnaire
    //#btn_ajout_proposit: quand il est cliqué a joute un champ au plus pour la saisie de la propostion
    const btn_ajout_proposit = document.querySelector('#btn_ajout_proposit_' + quizzId);
    btn_ajout_proposit.addEventListener('click', function(event) {
        const texte = ` <div class="row">
                      <div class="input-field col l10">
                         <div class="input-field col l8">
                            <textarea id="pro${propostionsuivante}_quizze" class="materialize-textarea"></textarea>
                            <label for="pro${propostionsuivante}_quizze">Une autre proposition</label>
                          </div>
                          <div class="input-field col l2">
                             <label> <input name="proposition" type="radio" id="rad${propostionsuivante}" /> <span></span> </label>
                          </div>
                      </div>
                    </div> `;
        const html = document.createElement('div');
        html.id = 'divAjouter' + propostionsuivante;
        html.innerHTML = texte;
        document.querySelector('#container_pro_quizz_dynamique').appendChild(html);
        propostionsuivante++;
    }, false);
    //id_creer_question_quizzId: ajoute la question et proposition sur le serveur
    document.querySelector('#id_creer_question_' + quizzId).addEventListener('click', function() {
        creerQuestion(quizzId, function() {
            document.querySelector('#btn_retour_creer_quizz').click();
        });
        //on supprime le button car la prochaine fois on fera encore un appendChild dans son parent
        this.parentNode.removeChild(this);
        //ideme pour le boutton ajoutPropostion
        btn_ajout_proposit.parentNode.removeChild(btn_ajout_proposit);
    }, false);
    //on remonte en haut de la page pour voir le debut du quizze
    window.scrollTo(0, 0);
}

function creerQuestion(quizzId, cb) {
    let listeProposition = [];
    let i = 0;
    Array.from(document.getElementsByName('proposition')).map((x) => {
        const uneProp = {
            'content': document.querySelector('#pro' + x.id.substring(3) + '_quizze').value,
            'proposition_id': i,
            'correct': x.checked ? true : false,
        };
        listeProposition.push(uneProp);
        i++;

    });

    const body = {
        'question_id': Number(document.querySelector('#nbrquest' + quizzId).innerHTML),
        'sentence': document.querySelector('#question_quizze').value,
        'propositions': listeProposition,
    };
    const urlajouteQues = `${state.serverUrl}/quizzes/${quizzId}/questions/`;
    ajouteQuestion(urlajouteQues, JSON.stringify(body), (rep) => {
        if (rep == 'OK') {
            infobulle('questionnaire ajouté avec succes', 'green');
            const contentNbrQuestion = document.querySelector('#nbrquest' + quizzId);
            //on incremente le nombre de question pour la question suivante
            contentNbrQuestion.innerHTML = Number(contentNbrQuestion.innerHTML) + 1;
            // document.querySelector('#id-mesquizzes').click();
        } else {
            avertissement('Une Erreur Est survenu l\'or de l\'envoi \n Veillez contacter l\'administrateur');
        }
        cb();
    });
}

function cliqueModifQuizz() {
    //recupere l'id de son parent (qui est l'id du quizze en question)
    const quizzId = this.parentNode.dataset.quizzid;
    //on cache le formulaire ajout quizze 
    document.querySelector('#div_creer_cmpte').style.display = 'none';
    //on cache le formulaire d'ajout question s'il est affiché 
    document.querySelector('#div_Ajoute_Question').style.display = 'none';
    //on cache le div contenant la liste des repondant 
    document.querySelector('#div_note_quizz').style.display = 'none';
    //on affiche le quizze en question dans le formulaire de modification
    document.querySelector('#titre_modif_quiz').value = document.querySelector('#titr' + quizzId).innerHTML;
    document.querySelector('#desc_modif_quiz').value = document.querySelector('#desc' + quizzId).innerHTML;
    //on vide le contenaire des questions et propositions
    document.querySelector('#content_questionnaire_modif').innerHTML = '';

    const div_modif_Quizz = document.querySelector('#div_modif_Quizz');
    div_modif_Quizz.style.display = 'block'; //on affiche le formulaire pour l'ajout questionnaire
    //on ajoute cet evenement au cas ou l'utilisateur veut retourner au formulaire <<creer quizze>>
    document.querySelector('#btn_retour_modif_quizz').addEventListener('click', function() {
        //on cache le formulaire ajout question
        div_modif_Quizz.style.display = 'none';
        //on affiche le formulaire ajout quizze
        document.querySelector('#div_creer_cmpte').style.display = 'block';
    }, false);

    const contentBtnModifier = document.querySelector('#content_envoyer_modif');
    contentBtnModifier.innerHTML = `
                <div class="col l4">
                  <button class="btn waves-effect waves-light" type="button" id="modif_quizz_${quizzId}">Modifier
                    <i class="material-icons right">border_color</i>
                  </button>
                </div>`;
    const contentAffiQuestion = document.querySelector('#content_affQuest_modif');
    //on met le boutton afficher les question dans contentAffiQuestion
    contentAffiQuestion.innerHTML = `
                                    <div class="col l8" style="margin-left: 60%; color:green; text-decoration:underline;cursor:pointer" id="affich_quest_quizz_${quizzId}">
                                         edit question
                                    </div>`;
    //#modif_quizz_: quand il est cliqué, on envoi le modif au serveur et met a jour l'interface
    const modif_quizz = document.querySelector('#modif_quizz_' + quizzId);
    modif_quizz.addEventListener('click', function() {

        this.parentNode.removeChild(this);

        const body = {
            'title': document.querySelector('#titre_modif_quiz').value,
            'description': document.querySelector('#desc_modif_quiz').value,
            'open': document.querySelector('#ouver_fermer_quizz').checked,
        };
        const urlModif = `${state.serverUrl}/quizzes/${quizzId}/`;
        //on modifi d'abord le corps du quizz, ensuite les questionnaires
        modificationQuizz(urlModif, JSON.stringify(body), (rep) => {
            if (rep == 'OK') {
                //si les questionnaires ont été affiché pour être modifier on les modifi
                if (document.querySelector('#content_questionnaire_modif').innerHTML != '') {
                    sendQuestionModifQuizz();
                } else { //on affiche l'infobulle directement
                    infobulle('modification effectuée avec succes', 'green');
                    //on met à jour l'interface
                    document.querySelector('#id-mesquizzes').click();
                }
            } else {
                avertissement('Une Erreur Est survenu l\'or de la modification \n Veillez contacter l\'administrateur');
            }
            document.querySelector('#btn_retour_modif_quizz').click();
        });
    });

    //affich_quest_quizz_: quand il est cliqué, on affiche les questionnaires et propositions du quizze
    document.querySelector('#affich_quest_quizz_' + quizzId).addEventListener('click', function() {

        this.parentNode.removeChild(this);
        const addr = `${state.serverUrl}/quizzes/${quizzId}/questions/`;
        state.currentQuizz = quizzId;
        getQuizzeQuestionnaires(addr, (reponse) => {
            if (reponse == 'OK')
                renderCurrentModifQuestion();
            else infobulle('Une erreur est survenu l\'ors de la récuperation des questionnaires\n Veillez contacter l\'administrateur', 'red');
        }); // recupere les questionnaires du quizz a modifier 

    }, false);

    function sendQuestionModifQuizz() {
        let listeProposition = [];
        let prev_questionId = -1;
        let current_questionId;
        let nombreErreur = 0;
        /*
        prev_questionId: est l'id de la question precedente
        current_questionId: est l'id de la question courante
        ces deux variables permet de savoir chaque fois on a changé de question l'ors du parcours 
        des propositions(tous les propositions de meme question sont identifiées dans l'id de la proposition)
        */
        Array.from(document.getElementsByClassName('modif_proposition')).map((x) => {
            current_questionId = x.id.substring(x.id.lastIndexOf('_') + 1);
            const current_proposition = x.id.substring(7, x.id.indexOf('_') + 1);
            const uneProp = {
                'content': document.querySelector('#quizz_' + current_proposition + '_' + current_questionId).value,
                'proposition_id': current_proposition,
                'correct': x.checked ? true : false,
            };
            listeProposition.push(uneProp);
            /*si on a changé de question alors on envoie les modifications de la question précédente
             et on vide listeProposition*/
            if (current_questionId != prev_questionId && prev_questionId != -1) {
                /* a cet instant le dernier element dans listeProposition est la première proposition
                 de la proposition suivante donc on pop en suite on push cette proposition
                 pour être envoyer après*/
                const proposition_question_suivante = listeProposition.pop();
                /* a partir de là on a la liste des propositions de la question courante*/
                const body = {
                    'sentence': document.querySelector('#quest' + prev_questionId).value,
                    'propositions': listeProposition,
                };
                const urlmdifQuizzQuestion = `${state.serverUrl}/quizzes/${quizzId}/questions/${prev_questionId}/`;
                //on vide la liste des propositions
                listeProposition = [];
                modificationQuizz(urlmdifQuizzQuestion, JSON.stringify(body), (rep) => {
                    if (rep === 'ERREUR')
                        /* à la sortie de la boucle on saura que l'envoi d'une modification a echoué*/
                        nombreErreur++;

                });
                //on remet la proposition suprimer pour la question suivante
                listeProposition.push(proposition_question_suivante);
            }
            prev_questionId = current_questionId;
        });
        /* a la sortie il faut envoyer le dernier current_questionId, car la condition 
        if(current_questionId!=prev_questionId && prev_questionId!=-1){ est executé jusqu'a (n-1)ieme fois
        */
        const body = {
            'sentence': document.querySelector('#quest' + prev_questionId).value,
            'propositions': listeProposition,
        };
        const urlmdifQuizzQuestion = `${state.serverUrl}/quizzes/${quizzId}/questions/${prev_questionId}/`;
        modificationQuizz(urlmdifQuizzQuestion, JSON.stringify(body), (rep) => {
            if (rep === 'ERREUR')
                /* à la sortie de la boucle on saura que l'envoi d'une modification a echoué*/
                nombreErreur++;
            console.log(listeProposition);
        });
        if (nombreErreur == 0) //tout ces bien passés
            infobulle('modification effectuée avec succes', 'green');
        else {
            infobulle('Une erreur est survenu l\'ors de la modification\n Veillez contacter l\'administrateur', 'red');
            //on met à jour l'interface
            document.querySelector('#id-mesquizzes').click();
        }
    }
}

function renderCurrentModifQuestion() {
    document.querySelector('#content_questionnaire_modif').innerHTML = state.questionnaires.map((quest) => {
        let undiv = `<span id="unspan_${state.currentQuizz}_${quest.question_id}">
                    <input type="text" class="sentnce" value="${quest.sentence}" id="quest${quest.question_id}"/>
                    <button class="btnSuprimer" onclick="suprimerQuestQuizz(${quest.question_id})"><i class="material-icons right">delete_forever</i>button</button>`;
        undiv += htmlQuestionModifList(quest.question_id, quest.propositions);
        undiv += '</span>';
        return undiv;
    }).join('');
}

function suprimerQuestQuizz(questionId) {

    const urlSupQuizz = `${state.serverUrl}/quizzes/${state.currentQuizz}/questions/${questionId}/`;
    supQuestionQuizz(urlSupQuizz, (rep) => {
        if (rep === 'OK') {
            //on enleve la question et ses propositions sur la page
            const uneQuestion = document.querySelector('#unspan_' + state.currentQuizz + '_' + questionId);
            uneQuestion.parentNode.removeChild(uneQuestion);
        } else
            infobulle('Une erreur est survenu l\'ors de la supression\n Veillez contacter l\'administrateur', 'red');

    });
}

function renderMesReponses(dataquiz, unereponse, questionnaire) {
    // les éléments à mettre à jour : le conteneur pour la liste des quizz de user
    const usersElt = document.querySelector('#id-mes-reponses-quiz');
    //unereponse : la reponse à un quizz
    //dataquizz: le quizze en question
    htmlMesReponseList(dataquiz, questionnaire, (html, idQuestion) => {

        const Elmenthtml = document.createElement('div'); //on crée un element html
        Elmenthtml.innerHTML = html; //on met le text générer là dans
        usersElt.appendChild(Elmenthtml); //on l'ajoute dans notre conteneur!
        //une fois le html mis dans la page, on met en evidence les reponses du users
        unereponse.answers.map((rep) => {
            let element=null;
            if( (element = document.querySelector('#propstion' + rep.proposition_id + '_' + idQuestion.pop() + '_' + dataquiz.quiz_id))!==null)
                 element.setAttribute('class', 'choixuser');

        });

    });
}

function infobulle(texte, couleur = 'black') {
    const blinfo = document.querySelector('#info-user');
    blinfo.innerHTML = texte;
    blinfo.style.display = 'inline';
    blinfo.style.backgroundColor = couleur;
    //on remonte en haut de la page pour voir le debut du quizze
    window.scrollTo(0, 0);
    setTimeout(function() {
        blinfo.style.display = 'none';
    }, 5000);
}

function avertissement(texte) {
    const avertiss = document.querySelector('#txteAvertissement');
    avertiss.innerHTML = texte;
    avertiss.style.display = 'block';
}
