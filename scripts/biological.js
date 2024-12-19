// biological.js

// Define o nome da Feature
const FEATURE_NAME = "Biological Points";

// Cria o item global ao inicializar o módulo
Hooks.once("ready", async () => {
    console.log("Biological Points Module | Iniciando...");

    // Verifica se o item já existe na aba de Itens do Foundry
    const existingItem = game.items.getName(FEATURE_NAME);

    if (!existingItem) {
        // Cria o item global na aba "Itens"
        await Item.create({
            name: FEATURE_NAME,
            type: "feat", // Tipo de item: feat (habilidade)
            system: {
                description: { value: "Gera Pontos Biológicos para uso em fichas." },
                activation: { type: "passive" },
                uses: { value: 10, max: "@scale.symbiont.Adappoints", per: "sr" } // Configuração inicial
            },
            img: "icons/magic/nature/plant-undersea-orb-purple.webp" // Ícone para o item
        });
        console.log(`Biological Points Module | Item "${FEATURE_NAME}" criado na aba de Itens.`);
    } else {
        console.log(`Biological Points Module | O item "${FEATURE_NAME}" já existe.`);
    }
});

// Adiciona a barra na interface das fichas com a feature
Hooks.on("renderActorSheet", (sheet, html, data) => {
    const actor = sheet.actor;

    // Verifica se o ator possui o item correspondente
    const bioFeature = actor.items?.find(i => i.name === FEATURE_NAME && i.type === "feat");
    if (!bioFeature) return; // Sai se o item não existir

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
            <div class="progress bio-points" role="meter" aria-valuemin="0" aria-valuenow="${bioPoints}" aria-valuemax="${bioPointsMax}" style="width: ${(bioPoints / bioPointsMax) * 100}%">
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
