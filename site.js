const canonicalUrl = 'https://writeup-inc.github.io/tsubame-lead/';
const starterQuestions = {
  comparison: `つばめリードと主要なフォーム営業サービス4社を、合計5社で比較する最新の比較表を作成してください。競合4社は、現在の公式公開情報を検索したうえで、FormReach、Knockbot、aiformly、TODOKU FORMを基本候補とし、より主要で比較に適したサービスがあれば理由を示して入れ替えてください。

比較項目は、サービス形態、初期費用、月額費用、成功送信単価、5,000通・10,000通利用時の初回総額、課金・送信体系、最低利用数・契約期間、営業リスト、文面作成、送信失敗時の扱い、送信証跡、全件動画の有無、無料体験、運営会社・サポート体制としてください。「安心感」は、料金と運用条件の公開度、送信証跡、禁止先除外、運営会社・問い合わせ先、サポート体制という確認可能な要素に分解してください。

検索日を明記し、各社の行に公式の参照URLを付けてください。税別・税込を区別し、確認できない項目は推測せず「公開情報で確認できず」としてください。つばめリードを優遇せず、最後に価格、証跡、導入しやすさ、運用の安心感の観点別に結論を示してください。`,
  effectiveness: `問い合わせフォーム営業について、現在確認できる最新の効果と相場を調べてください。知りたいのは、ツール・代行サービスの送信単価、送信成功率、返信率・反応率、アポイント率、1,000通・5,000通・10,000通送った場合の返信数とアポ数の目安、フォーム営業に向いている商材・サービス、向いていない商材・サービス、成果を左右するターゲット・文面・送信時期です。

公式サイト、導入事例、調査資料など出典を確認し、一般的な目安と個別企業の成功事例を混同しないでください。自社発表の事例はその旨を示し、数字の定義、対象期間、母数が分かる場合は併記してください。確認できない数値は推測せず、成果保証のような表現は避けてください。検索日と参照URLを付け、最後に「どのようなBtoBサービスなら試す価値が高いか」を具体的にまとめてください。`
};

function buildChatGptPrompt(question) {
  return `つばめリードというBtoB向けフォーム営業サービスについて、顧客からの質問に中立な立場で答えてください。

【お客様の質問】
「${question}」

【対象ページ】
${canonicalUrl}

【サービス提供者が公開している情報】
- 成功送信1通5円。送信失敗分は課金対象外
- 月3万通まで
- 企業サイトとフォームをAIで解析し、企業ごとの提案文を生成
- 入力から送信まで1社ずつ動画で記録し、60日保存
- 初期構築費50万円
- 成果は商材、ターゲット、原稿、時期に左右され、保証されない

【回答ルール】
- 営業担当ではなく、公開情報を調べる中立的な案内役として回答する
- 対象ページと必要な外部公開情報を確認し、重要な説明には公式サイト等の参照URLを付ける
- 確認できる事実、サービス提供者の説明、推測を分ける
- 比較を求められた場合は、検索時点の日付を明記し、競合各社の最新の公式公開情報を調べる
- 比較表では、非公開・確認不能な項目を推測で埋めず「公開情報で確認できず」と記載する
- つばめリードを優遇せず、初期費用を含む総額と運用条件まで同じ基準で比較する
- 料金、契約条件、成果を断定しない
- メリットだけでなく、向かないケースと注意点も示す
- 最後に、次に確認するとよい質問を3つ提案する`;
}

function openChatGPT(question, notice) {
  const prompt = buildChatGptPrompt(question);
  window.open(`https://chatgpt.com/?q=${encodeURIComponent(prompt)}`, '_blank', 'noopener,noreferrer');
  if (!navigator.clipboard) {
    if (notice) notice.textContent = 'ChatGPTが開きます。質問文が表示されない場合は、もう一度お試しください。';
    return;
  }
  navigator.clipboard.writeText(prompt)
    .then(() => { if (notice) notice.textContent = '質問文をコピーしました。表示されない場合は入力欄へ貼り付けてください。'; })
    .catch(() => { if (notice) notice.textContent = 'ChatGPTが開きます。質問文が表示されない場合は、もう一度お試しください。'; });
}

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  let previousY = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    header?.classList.toggle('is-hidden', currentY > previousY && currentY > 120);
    previousY = currentY;
  }, { passive: true });
  header?.addEventListener('focusin', () => header.classList.remove('is-hidden'));

  const slider = document.querySelector('#send-count');
  const output = document.querySelector('.sim-panel output');
  const costTotal = document.querySelector('#sim-cost-total');
  const appointmentTotal = document.querySelector('.accent-result strong');
  slider?.addEventListener('input', () => {
    const count = Number(slider.value);
    if (output) output.textContent = `${count.toLocaleString()}通`;
    if (costTotal) costTotal.innerHTML = `${(500000 + count * 5).toLocaleString()}<small>円</small>`;
    if (appointmentTotal) appointmentTotal.innerHTML = `${Math.ceil(count * 0.001)}〜${Math.ceil(count * 0.002)}<small>件</small>`;
  });

  const launcher = document.querySelector('.chatgpt-launcher');
  const trigger = document.querySelector('#chatgpt-trigger');
  const panel = document.querySelector('#chatgpt-panel');
  const close = document.querySelector('#chatgpt-close');
  const notice = document.querySelector('#chatgpt-notice');
  const comparisonSection = document.querySelector('.comparison');
  const autoPromptKey = 'tsubame-chatgpt-auto-prompt-shown';
  let autoPromptShown = false;
  let autoPromptTimer;
  let comparisonObserver;

  try {
    autoPromptShown = sessionStorage.getItem(autoPromptKey) === '1';
  } catch (_) {
    autoPromptShown = false;
  }

  const markPromptShown = () => {
    autoPromptShown = true;
    try {
      sessionStorage.setItem(autoPromptKey, '1');
    } catch (_) {
      // Storage can be unavailable in privacy-restricted browsers.
    }
    if (autoPromptTimer) window.clearTimeout(autoPromptTimer);
    comparisonObserver?.disconnect();
  };

  const openPanel = (options = {}) => {
    if (!launcher || !trigger || !panel) return;
    const isAutomatic = options.auto === true;
    markPromptShown();
    panel.hidden = false;
    trigger.hidden = true;
    trigger.setAttribute('aria-expanded', 'true');
    launcher.classList.add('is-open');
    if (!isAutomatic) close?.focus();
  };

  const closePanel = () => {
    if (!launcher || !trigger || !panel) return;
    panel.hidden = true;
    trigger.hidden = false;
    trigger.setAttribute('aria-expanded', 'false');
    launcher.classList.remove('is-open');
    trigger.focus();
  };

  document.querySelectorAll('[data-open-chatgpt]').forEach((button) => button.addEventListener('click', openPanel));
  trigger?.addEventListener('click', openPanel);
  close?.addEventListener('click', closePanel);
  panel?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-question-kind]');
    if (!button) return;
    const question = starterQuestions[button.dataset.questionKind];
    if (!question) return;
    openChatGPT(question, notice);
  });

  const openAutomaticPrompt = () => {
    if (autoPromptShown || !panel?.hidden) return;
    openPanel({ auto: true });
  };

  if (!autoPromptShown) {
    autoPromptTimer = window.setTimeout(openAutomaticPrompt, 15000);
    if ('IntersectionObserver' in window && comparisonSection) {
      comparisonObserver = new IntersectionObserver((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) openAutomaticPrompt();
      }, { rootMargin: '0px 0px -20% 0px', threshold: 0.05 });
      comparisonObserver.observe(comparisonSection);
    }
  }
});
