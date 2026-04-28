/**
 * Tiny in-app i18n. No external deps.
 *
 * Keys come from a single shared dictionary so a missing translation falls
 * back to English at the call site. Use {var} placeholders — interpolation
 * is handled by t().
 */

export type Lang = "en" | "ar";
export const LANGS: Lang[] = ["en", "ar"];
export const DEFAULT_LANG: Lang = "en";

export const LANG_LABEL: Record<Lang, string> = {
  en: "EN",
  ar: "AR",
};

const dict = {
  en: {
    // Logical arrows. `arrow_fwd` follows reading direction (next), `arrow_back` is opposite (previous/home).
    arrow_fwd: "→",
    arrow_back: "←",

    // shared
    home: "Home",
    back: "Back",
    leaderboard: "Leaderboard",
    board: "Board",
    loading: "Loading…",
    curating: "Curating…",

    // landing default hero
    landing_eyebrow: "A Game by Etienne",
    landing_title_1: "Find your",
    landing_title_2: "signature",
    landing_title_3: "scent.",
    landing_tagline: "Play. Discover. Find your signature.",
    landing_play_eyebrow: "Begin",
    landing_play_label: "Play Now",
    landing_play_meta: "10 questions",
    pillar_01_t: "Trivia",
    pillar_01_s: "Ten questions, fifteen seconds each.",
    pillar_02_t: "Discover",
    pillar_02_s: "A scent personality, mapped.",
    pillar_03_t: "Match",
    pillar_03_s: "Your signature Etienne.",

    // landing challenge variant
    challenge_chip: "Challenge",
    challenge_dropped: "{name} dropped a score",
    challenge_beat_pre: "Beat",
    challenge_beat_post: "on Signature.",
    challenge_sub:
      "Ten questions. Fifteen seconds each. Show {name} how it's done.",
    challenge_accept: "Accept Challenge",
    challenge_pick_own: "or pick your own challenge",

    // play
    signature_challenge: "Signature Challenge",
    target_pre: "Target · beat",
    target_at: "at",
    enter_name_l1: "Enter your name",
    enter_name_l2: "to compete",
    name_subtitle:
      "Your score appears on the public leaderboard. Use a name or an Instagram handle.",
    format_q: "10 Questions",
    format_t: "15s Each",
    format_r: "1 Round",
    label_handle: "Instagram handle",
    label_name: "Your name",
    placeholder_input: "Your name or @handle",
    suffix_handle: "Handle",
    suffix_name: "Name",
    btn_begin: "Begin",
    legal:
      "By entering, you agree to appear on the leaderboard. We never sell your data.",
    top3_title: "Top 3 to beat",
    top3_count_one: "1 player",
    top3_count_many: "{n} on board",

    // identity errors
    err_required: "Add a name or @handle to compete.",
    err_too_long: "Keep it under 20 characters.",
    err_no_handle: "Add the handle after the @.",
    err_invalid_chars: "Letters, numbers, dots and underscores only.",

    // game
    quit: "Quit",
    confirm_quit: "Leave this round? Your progress will be lost.",
    score: "Score",
    top_chase_prefix: "Top",
    question: "Question",
    times_up: "Time's up.",
    confident: "A confident answer.",
    not_this_time_pre: "Not this time. The answer was",

    // results
    your_signature: "Your Signature",
    accuracy_label: "accuracy",
    saving: "Saving…",
    rank: "Rank",
    points_to_climb: "to climb",
    score_saved: "Score saved",
    score_save_error: "Couldn't save — try again later",
    rank_top1: "You hold the top spot.",
    rank_top3: "You're competing for the top spot.",
    rank_top10: "Top 10. {n} points away from the next rank.",
    rank_below: "Position {n} of {total}. Climb higher.",
    on_the_board: "You're on the board. Climb higher.",
    leader_label: "Leader",
    pts: "pts",
    your_match: "Your Match",
    play_again: "Play Again",
    challenge_friend: "Challenge Friend",
    copied: "Copied ✓",
    share_story: "Share Story",
    ask_guide: "Ask the Scent Guide",
    discount_code: "Use code SIGNATURE10 for 10% off",
    delta_up: "↑ {n} pts vs last attempt",
    delta_eq: "Matched your best",
    delta_down: "Last best · {n} pts",

    // leaderboard
    leaderboard_eyebrow: "Signature Challenge",
    leaderboard_title: "Leaderboard",
    leaderboard_subtitle: "The most precise noses in the room.",
    players_count_one: "1 Player · Top 10 Compete",
    players_count_many: "{n} Players · Top 10 Compete",
    no_scores: "No scores yet — be the first.",
    play: "Play",
    play_to_climb: "Play to Climb",
    champion: "Champion",
    runner_up: "Runner-up",
    third: "Third",
    you: "You",
    more_competing: "+ {n} more competing",

    // scent guide
    guide_eyebrow: "Etienne",
    guide_title: "Scent Guide",
    guide_close: "Close",
    guide_input_placeholder: "Ask about scents, gifts, your result…",
    guide_send: "Send",
    guide_welcome:
      "I'm the Etienne Scent Guide. Ask me about our perfumes, scent notes, gifting, or your quiz result. I'll keep it warm and brief.",
    guide_error:
      "I lost the thread for a moment. Try again — I'm still here.",
    guide_default: "I'm here when you'd like to talk.",
    suggestion_1: "What should I gift my mother?",
    suggestion_2: "I love clean linen — what's my match?",
    suggestion_3: "Tell me about After Hours",
    suggestion_4: "Help me understand my quiz result",

    // Levels
    level_master_title: "Master of Scent",
    level_master_blurb:
      "You read fragrance the way sommeliers read wine. Etienne sees you — clearly.",
    level_connoisseur_title: "Connoisseur",
    level_connoisseur_blurb:
      "A trained nose and a confident hand. You know what you like.",
    level_explorer_title: "Explorer",
    level_explorer_blurb:
      "You're learning the language of scent. Keep wandering — it suits you.",
    level_beginner_title: "Curious Beginner",
    level_beginner_blurb:
      "Every great nose started here. The Discovery Kit will be your first teacher.",

    // Traits
    trait_fresh: "Fresh",
    trait_warm: "Warm",
    trait_sensual: "Sensual",
    trait_clean: "Clean",
    trait_soft: "Soft",
    trait_free: "Free",
    trait_refined: "Refined",
    trait_curious: "Curious",
  },

  ar: {
    arrow_fwd: "←",
    arrow_back: "→",

    home: "الرئيسية",
    back: "رجوع",
    leaderboard: "لوحة الصدارة",
    board: "اللوحة",
    loading: "جارٍ التحميل…",
    curating: "تُحضَّر…",

    landing_eyebrow: "لعبة من إيتيان",
    landing_title_1: "اكتشف",
    landing_title_2: "بصمتك",
    landing_title_3: "العطرية.",
    landing_tagline: "العب. اكتشف. ابحث عن بصمتك.",
    landing_play_eyebrow: "ابدأ",
    landing_play_label: "العب الآن",
    landing_play_meta: "١٠ أسئلة",
    pillar_01_t: "الأسئلة",
    pillar_01_s: "عشرة أسئلة، خمس عشرة ثانية لكل سؤال.",
    pillar_02_t: "اكتشاف",
    pillar_02_s: "شخصيتك العطرية مرسومة.",
    pillar_03_t: "تطابق",
    pillar_03_s: "عطرك المميز من إيتيان.",

    challenge_chip: "تحدٍّ",
    challenge_dropped: "{name} سجّل نتيجته",
    challenge_beat_pre: "اهزم",
    challenge_beat_post: "في تحدي البصمة.",
    challenge_sub:
      "عشرة أسئلة. خمس عشرة ثانية لكل سؤال. أرِ {name} كيف يكون التميّز.",
    challenge_accept: "اقبل التحدي",
    challenge_pick_own: "أو اختر تحديك بنفسك",

    signature_challenge: "تحدي البصمة",
    target_pre: "الهدف · اهزم",
    target_at: "بـ",
    enter_name_l1: "أدخل اسمك",
    enter_name_l2: "للمنافسة",
    name_subtitle:
      "نتيجتك ستظهر في لوحة الصدارة العامة. استخدم اسمك أو حساب إنستغرام.",
    format_q: "١٠ أسئلة",
    format_t: "١٥ ثانية لكل سؤال",
    format_r: "جولة واحدة",
    label_handle: "حساب إنستغرام",
    label_name: "اسمك",
    placeholder_input: "اسمك أو @الحساب",
    suffix_handle: "حساب",
    suffix_name: "اسم",
    btn_begin: "ابدأ",
    legal:
      "بالمشاركة، توافق على ظهور اسمك في لوحة الصدارة. لن نبيع بياناتك أبدًا.",
    top3_title: "أبرز ثلاثة للهزيمة",
    top3_count_one: "لاعب واحد",
    top3_count_many: "{n} على اللوحة",

    err_required: "أضف اسمًا أو @حسابًا للمشاركة.",
    err_too_long: "اجعله أقل من ٢٠ حرفًا.",
    err_no_handle: "أضف الحساب بعد علامة @.",
    err_invalid_chars: "حروف وأرقام ونقاط وشرطات سفلية فقط.",

    quit: "خروج",
    confirm_quit: "هل تترك هذه الجولة؟ سيُفقد تقدّمك.",
    score: "النتيجة",
    top_chase_prefix: "الأول",
    question: "سؤال",
    times_up: "انتهى الوقت.",
    confident: "إجابة واثقة.",
    not_this_time_pre: "ليس هذه المرة. الإجابة كانت",

    your_signature: "بصمتك",
    accuracy_label: "دقة",
    saving: "يُحفظ…",
    rank: "المرتبة",
    points_to_climb: "للصعود",
    score_saved: "حُفظت النتيجة",
    score_save_error: "تعذّر الحفظ — حاول لاحقًا",
    rank_top1: "أنت في القمة.",
    rank_top3: "أنت تنافس على القمة.",
    rank_top10: "ضمن العشرة الأوائل. {n} نقطة لتجاوز التالي.",
    rank_below: "المركز {n} من {total}. تسلّق أعلى.",
    on_the_board: "أنت على اللوحة. تسلّق أعلى.",
    leader_label: "الأول",
    pts: "نقطة",
    your_match: "عطرك",
    play_again: "العب مجددًا",
    challenge_friend: "تحدَّ صديقًا",
    copied: "نُسخ ✓",
    share_story: "مشاركة القصة",
    ask_guide: "اسأل دليل العطر",
    discount_code: "استخدم كود SIGNATURE10 لخصم ١٠٪",
    delta_up: "↑ {n} نقطة عن آخر محاولة",
    delta_eq: "تعادلت مع أفضل نتيجة",
    delta_down: "أفضل نتيجة سابقة · {n} نقطة",

    leaderboard_eyebrow: "تحدي البصمة",
    leaderboard_title: "لوحة الصدارة",
    leaderboard_subtitle: "أدقّ الأنوف في القاعة.",
    players_count_one: "لاعب واحد · العشرة الأوائل يتنافسون",
    players_count_many: "{n} لاعبًا · العشرة الأوائل يتنافسون",
    no_scores: "لا نتائج بعد — كن الأول.",
    play: "العب",
    play_to_climb: "العب لتصعد",
    champion: "البطل",
    runner_up: "الثاني",
    third: "الثالث",
    you: "أنت",
    more_competing: "+ {n} لاعبًا آخر",

    guide_eyebrow: "إيتيان",
    guide_title: "دليل العطر",
    guide_close: "إغلاق",
    guide_input_placeholder: "اسأل عن العطور، الهدايا، نتيجتك…",
    guide_send: "إرسال",
    guide_welcome:
      "أنا دليل العطر من إيتيان. اسألني عن عطورنا، النوتات، الهدايا، أو نتيجتك. سأبقى هادئًا ومختصرًا.",
    guide_error: "فقدت الخيط للحظة. حاول مجدّدًا — ما زلت هنا.",
    guide_default: "أنا هنا حين ترغب بالحديث.",
    suggestion_1: "ما الذي يجب أن أهديه أمي؟",
    suggestion_2: "أحب رائحة الكتان النظيف — ما عطري؟",
    suggestion_3: "أخبرني عن After Hours",
    suggestion_4: "ساعدني في فهم نتيجتي",

    level_master_title: "خبير العطور",
    level_master_blurb:
      "تقرأ العطور كما يقرأ الخبراء النبيذ. إيتيان يراك بوضوح.",
    level_connoisseur_title: "خبير ذوّاق",
    level_connoisseur_blurb:
      "أنف مدرَّب ويد واثقة. تعرف ما يناسبك.",
    level_explorer_title: "مستكشف",
    level_explorer_blurb:
      "أنت تتعلّم لغة العطر. تابع التجوال — هو يليق بك.",
    level_beginner_title: "مبتدئ فضولي",
    level_beginner_blurb:
      "كل أنف عظيم بدأ من هنا. مجموعة Discovery Kit ستكون معلّمك الأول.",

    trait_fresh: "منعش",
    trait_warm: "دافئ",
    trait_sensual: "حسّي",
    trait_clean: "نقي",
    trait_soft: "ناعم",
    trait_free: "حر",
    trait_refined: "أنيق",
    trait_curious: "فضولي",
  },
} as const;

export type StringKey = keyof (typeof dict)["en"];

/** Translate. Falls back to English string if AR key is empty. */
export function tr(
  lang: Lang,
  key: StringKey,
  vars?: Record<string, string | number>
): string {
  const enVal = dict.en[key] as string;
  const arVal = (dict.ar as Record<string, string>)[key];
  let s = lang === "ar" && arVal ? arVal : enVal;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    }
  }
  return s;
}
