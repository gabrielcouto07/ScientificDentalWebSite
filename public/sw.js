/**
 * Service worker de desligamento ("kill switch").
 *
 * Este site NÃO usa service worker. Este arquivo existe só para desfazer
 * registros antigos deixados em http://localhost:3000 por outros projetos que
 * já rodaram nessa mesma porta (a origem é compartilhada entre todos eles).
 *
 * Um service worker antigo com cache de "app shell" devolve os arquivos
 * JavaScript dele em vez dos do servidor: o HTML novo aparece por um instante
 * e o layout antigo volta assim que o JavaScript velho assume a página.
 * Devolver 404 aqui não resolve, porque o navegador mantém o registro quando a
 * verificação de atualização falha. Servindo este script, o navegador o instala
 * no lugar do antigo e ele então se remove.
 *
 * Pode ser apagado quando nenhum navegador da equipe tiver mais o registro
 * antigo. Enquanto existir, o custo é um arquivo de menos de 1 KB.
 */
self.addEventListener("install", () => {
  // Assume o lugar do service worker antigo sem esperar as abas fecharem.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // 1. Apaga todo cache criado pelo service worker antigo nesta origem.
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));

      // 2. Remove o próprio registro: a partir daqui nada mais é interceptado.
      await self.registration.unregister();

      // 3. Recarrega as abas abertas para que voltem a falar direto com o servidor.
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) {
        client.navigate(client.url);
      }
    })(),
  );
});

// Sem listener de "fetch" de propósito: nenhuma requisição é interceptada.
