export const TALENT_EFFECTS = {
  data_eye: {
    requirementModifier: {
      stat: "intellect",
      bonus: 2,
      context: "data_tasks",
    },
  },

  prompt_strategist: {
    requirementModifier: {
      stat: "wisdom",
      bonus: 2,
      context: "prompt_tasks",
    },
  },

  chaining_specialist: {
    unlocksModulesEarly: ["sap_chaining"],
  },

  ethical_compass: {
    xpWeight: "ethics",
  },
};
