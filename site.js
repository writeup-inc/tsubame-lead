const canonicalUrl = 'https://writeup-inc.github.io/tsubame-lead/';

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
- 対象ページと必要な外部公開情報を確認し、重要な説明には参照URLを付ける
- 確認できる事実、サービス提供者の説明、推測を分ける
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
  const results = document.querySelectorAll('.sim-results strong');
  slider?.addEventListener('input', () => {
    const count = Number(slider.value);
    if (output) output.textContent = `${count.toLocaleString()}通`;
    if (results[0]) results[0].innerHTML = `${(count * 5).toLocaleString()}<small>円</small>`;
    if (results[1]) results[1].innerHTML = `${Math.ceil(count * 0.001)}〜${Math.ceil(count * 0.002)}<small>件</small>`;
  });

  const launcher = document.querySelector('.chatgpt-launcher');
  const trigger = document.querySelector('#chatgpt-trigger');
  const panel = document.querySelector('#chatgpt-panel');
  const close = document.querySelector('#chatgpt-close');
  const notice = document.querySelector('#chatgpt-notice');

  const openPanel = () => {
    if (!launcher || !trigger || !panel) return;
    panel.hidden = false;
    trigger.hidden = true;
    trigger.setAttribute('aria-expanded', 'true');
    launcher.classList.add('is-open');
    close?.focus();
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
    const button = event.target.closest('[data-question]');
    if (!button) return;
    openChatGPT(button.dataset.question, notice);
  });
});
