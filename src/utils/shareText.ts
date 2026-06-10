import { Fighter } from '../types/fighter';
import { BattleResult } from '../types/battle';
import { randomFrom } from './random';

const APP_TAG = '#ObjectArena';

export function generateBattleShareCaption(
  winner: Fighter,
  loser: Fighter,
  result: BattleResult
): string {
  const templates = [
    `My ${winner.objectType} just destroyed a ${loser.objectType} in Object Arena. Didn't see that coming. 💀 ${APP_TAG}`,
    `${winner.name} (${winner.rarity} ${winner.class}) obliterated ${loser.name} in ${result.rounds} rounds. I am unstoppable. ${APP_TAG}`,
    `Nobody expected the ${winner.objectType} to be this powerful. I didn't either. ${winner.name} is a legend. ${APP_TAG}`,
    `${loser.name} thought they could handle ${winner.name}. They were wrong. Devastatingly wrong. ${APP_TAG}`,
    `${winner.name} used ${winner.specialMove} and I think I need to lie down. ${APP_TAG}`,
    `I scanned my ${winner.objectType} and it became a ${winner.rarity} ${winner.class}. Then it fought. Then it won. Then I cried. ${APP_TAG}`,
    `Turns out ${winner.objectType}s are the most dangerous objects on earth. Object Arena proves it. ${APP_TAG}`,
    `The battle lasted ${result.rounds} rounds. ${winner.name} showed no mercy. No mercy at all. ${APP_TAG}`,
  ];
  return randomFrom(templates);
}

export function generateFighterShareCaption(fighter: Fighter): string {
  const templates = [
    `I just scanned my ${fighter.objectType} and created ${fighter.name}, a ${fighter.rarity} ${fighter.class}. The world is not ready. ${APP_TAG}`,
    `${fighter.name}: ${fighter.rarity} ${fighter.class}. Special move: ${fighter.specialMove}. Challenge me if you dare. ${APP_TAG}`,
    `${fighter.funnyQuote} — ${fighter.name}, ${fighter.rarity} ${fighter.class} in Object Arena. ${APP_TAG}`,
    `My ${fighter.objectType} is now a ${fighter.rarity} fighter called ${fighter.name}. Your objects can't compete. ${APP_TAG}`,
    `Object Arena gave my ${fighter.objectType} a purpose. That purpose is violence. ${APP_TAG}`,
  ];
  return randomFrom(templates);
}

export function generateChallengeLink(fighterId: string): string {
  // PLACEHOLDER: Replace with real deep link / dynamic link in production
  // Use Firebase Dynamic Links or Branch.io for real challenge links
  return `https://objectarena.app/challenge/${fighterId}`;
}

export function generateBattleRecap(
  winner: Fighter,
  loser: Fighter,
  rounds: number
): string {
  const recaps = [
    `${winner.name} came out swinging and never looked back. ${loser.name} tried. They really tried. But this was not their day. After ${rounds} brutal rounds, the crowd went silent.`,
    `Nobody expected ${winner.name} to win this one. And yet — here we are. ${loser.name} put up a fight but the ${winner.rarity} class ran deep. Final round sealed it.`,
    `${loser.name} had the early lead. Things were looking grim for ${winner.name}. Then ${winner.specialMove} happened. Everything changed in an instant.`,
    `A ${rounds}-round classic. Both fighters gave everything. But only one had what it takes. ${winner.name}'s ${winner.class} energy proved too much.`,
    `${winner.name} was supposed to lose. The algorithm said so. The crowd said so. Nobody told ${winner.name} that. They did not read the memo.`,
  ];
  return randomFrom(recaps);
}
