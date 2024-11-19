// PLAYER i.e VILLAGE
class Village {
  constructor() {
    this.level = 1;
    this.maxHealth = 5; //max health for min Village health [10-200]
    this.health = this.maxHealth;
    this.hearts = 3;
    this.coins = 30;
    this.powerUps = {
      shield: { active: false, duration: 0, kill: 0 },
      dragon: { active: false, duration: 0, kill: 0 },
      hearts: { active: true, lives: this.hearts },
    };
  }
}

export default Village;
