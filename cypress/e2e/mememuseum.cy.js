describe('MemeMuseum - Test End-to-End', () => {
  
  beforeEach(() => {
    cy.visit('http://localhost:5173');
  });

  it('1. Dovrebbe caricare la Homepage e mostrare il Logo', () => {
    cy.contains('MEMEMUSEUM').should('be.visible');
  });

  it('2. Dovrebbe avere i link di navigazione principali nella Navbar', () => {
    cy.contains('Esplora').should('be.visible');
    cy.contains('Carica').should('be.visible');
    cy.contains('Meme del Giorno').should('be.visible');
  });

  it('3. Dovrebbe aprire il menu a tendina dei Filtri', () => {
    cy.contains('Filtra').click();
    cy.contains('Più Recente').should('be.visible');
    cy.contains('Più UpVote').should('be.visible');
  });

  it('4. Dovrebbe navigare alla pagina di Login cliccando su Accedi', () => {
    cy.contains('Accedi').click();
    cy.url().should('include', '/login');
    cy.contains('Bentornato!').should('be.visible');
  });

  it('5. Dovrebbe mostrare un errore se si tenta il Login con campi vuoti', () => {
    cy.contains('Accedi').click();
    cy.get('button[type="submit"]').click();
    cy.on('window:alert', (testo) => {
      expect(testo).to.contain('Errore'); 
    });
  });

  it('6. Dovrebbe navigare alla pagina di Registrazione partendo dal Login', () => {
    cy.contains('Accedi').click();
    cy.contains('Registrati').click(); 
    cy.url().should('include', '/register');
  });

  it('7. Dovrebbe avviare la ricerca del Meme del Giorno', () => {
    cy.contains('Meme del Giorno').click();
    cy.url().should('satisfy', (url) => url.includes('/daily') || url.includes('/meme/'));
  });

  it('8. Dovrebbe aprire la pagina dei dettagli cliccando su una Meme Card', () => {
    cy.get('img', { timeout: 10000 }).first().click();
    cy.url().should('include', '/meme/');
    cy.contains('Torna indietro').should('be.visible');
  });

  it('9. Dovrebbe mostrare i pulsanti dei Voti e Commenti nella pagina di Dettaglio', () => {
    cy.get('img', { timeout: 10000 }).first().click();
    cy.contains('Commenti').should('be.visible');
    cy.contains('Torna indietro').click();
    cy.url().should('eq', 'http://localhost:5173/');
  });

  it('10. Dovrebbe impedire di commentare se non si è loggati', () => {
    cy.get('img', { timeout: 10000 }).first().click();
    cy.contains('Devi accedere per poter commentare.').should('be.visible');
  });

});