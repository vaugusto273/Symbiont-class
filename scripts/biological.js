// biological.js

// Define o nome da Feature
const FEATURE_NAME = "Biological Points";

// Evento ao inicializar o módulo
Hooks.on("ready", async () => {
    console.log("Biological Points Module | Iniciando módulo...");

    // Itera sobre todas as fichas de jogadores e cria a feature, se necessário
    for (let actor of game.actors.filter(a => a.type === "character")) {
        await ensureFeatureExists(actor);
    }

    console.log("Biological Points Module | Verificação e criação da feature concluída.");
});

// Garante que a feature existe na ficha do ator
async function ensureFeatureExists(actor) {
    const existingFeature = actor.items.find(i => i.name === FEATURE_NAME && i.type === "feat");

    if (!existingFeature) {
        await actor.createEmbeddedDocuments("Item", [{
            name: FEATURE_NAME,
            type: "feat",
            system: {
                description: { value: "Gera Pontos Biológicos para a barra adicional." },
                activation: { type: "passive" },
                uses: { value: 10, max: 10, per: "day" }
            }
        }]);
        console.log(`Biological Points Module | Feature adicionada a: ${actor.name}`);
    }
}

// Adiciona a barra na interface das fichas com a feature
Hooks.on("renderActorSheet", (sheet, html, data) => {
    const actor = sheet.actor;

    // Verifica se o ator possui a feature
    const bioFeature = actor.items.find(i => i.name === FEATURE_NAME && i.type === "feat");
    if (!bioFeature) return; // Sai se a feature não existir

    // Valores para a barra
    const bioPoints = bioFeature.system.uses?.value || 0;
    const bioPointsMax = bioFeature.system.uses?.max || 0;

    // Gera a barra
    const bioBar = `
    <div class="meter-group">
        <div class="label roboto-condensed-upper">
            <span>${FEATURE_NAME}</span>
        </div>
        <div class="meter sectioned bio-points">
            <div class="progress bio-points" role="meter" aria-valuemin="0" aria-valuenow="${bioPoints}" aria-valuemax="${bioPointsMax}" style="--bar-percentage: ${(bioPoints / bioPointsMax) * 100}%">
                <div class="label">
                    <span class="value">${bioPoints}</span>
                    <span class="separator">/</span>
                    <span class="max">${bioPointsMax}</span>
                </div>
            </div>
        </div>
    </div>
    `;

    // Insere a barra no final da seção de stats
    const statsSection = html.find(".stats");
    if (statsSection.length) {
        statsSection.append(bioBar);
    }
});
