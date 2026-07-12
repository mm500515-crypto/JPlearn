// N5 文法資料 - 核心 50 個文法點
const GRAMMAR_DATA = [
  // ===== 基本句型 =====
  {
    id: 1,
    pattern: '〜は〜です',
    meaning: '～是～',
    category: '基本句型',
    explanation: '最基本的日文句型。「は」是主題助詞（讀作 wa），「です」是禮貌的斷定表現。',
    examples: [
      { jp: '私は学生です。', reading: 'わたしはがくせいです。', zh: '我是學生。' },
      { jp: 'これは本です。', reading: 'これはほんです。', zh: '這是書。' },
    ]
  },
  {
    id: 2,
    pattern: '〜は〜じゃないです / ではありません',
    meaning: '～不是～',
    category: '基本句型',
    explanation: '「です」的否定形。口語用「じゃないです」，書面語用「ではありません」。',
    examples: [
      { jp: '私は先生じゃないです。', reading: 'わたしはせんせいじゃないです。', zh: '我不是老師。' },
      { jp: 'これは雑誌ではありません。', reading: 'これはざっしではありません。', zh: '這不是雜誌。' },
    ]
  },
  {
    id: 3,
    pattern: '〜は〜ですか',
    meaning: '～是～嗎？',
    category: '基本句型',
    explanation: '疑問句。在句尾加上「か」即可構成問句。',
    examples: [
      { jp: 'あなたは日本人ですか。', reading: 'あなたはにほんじんですか。', zh: '你是日本人嗎？' },
      { jp: 'これは何ですか。', reading: 'これはなんですか。', zh: '這是什麼？' },
    ]
  },
  {
    id: 4,
    pattern: '〜も',
    meaning: '也～',
    category: '基本句型',
    explanation: '「も」取代「は」表示「也」。',
    examples: [
      { jp: '私も学生です。', reading: 'わたしもがくせいです。', zh: '我也是學生。' },
      { jp: '猫も好きです。', reading: 'ねこもすきです。', zh: '貓也喜歡。' },
    ]
  },

  // ===== 助詞 =====
  {
    id: 5,
    pattern: '〜の〜',
    meaning: '～的～',
    category: '助詞',
    explanation: '表示所屬關係，類似中文的「的」。',
    examples: [
      { jp: '私の本', reading: 'わたしのほん', zh: '我的書' },
      { jp: '日本語の先生', reading: 'にほんごのせんせい', zh: '日文的老師' },
    ]
  },
  {
    id: 6,
    pattern: '〜を〜',
    meaning: '把～（受詞助詞）',
    category: '助詞',
    explanation: '標示動作的受詞（目的語）。',
    examples: [
      { jp: 'ご飯を食べます。', reading: 'ごはんをたべます。', zh: '吃飯。' },
      { jp: '本を読みます。', reading: 'ほんをよみます。', zh: '看書。' },
    ]
  },
  {
    id: 7,
    pattern: '〜に〜（時間）',
    meaning: '在～（時間點）',
    category: '助詞',
    explanation: '表示具體的時間點。星期、幾月幾日、幾點等需要加「に」。但「今日」「明日」「毎日」等不加。',
    examples: [
      { jp: '七時に起きます。', reading: 'しちじにおきます。', zh: '七點起床。' },
      { jp: '日曜日に映画を見ます。', reading: 'にちようびにえいがをみます。', zh: '星期日看電影。' },
    ]
  },
  {
    id: 8,
    pattern: '〜に〜（場所・方向）',
    meaning: '去～・在～（目的地）',
    category: '助詞',
    explanation: '表示移動的目的地或存在的場所。',
    examples: [
      { jp: '学校に行きます。', reading: 'がっこうにいきます。', zh: '去學校。' },
      { jp: '部屋に猫がいます。', reading: 'へやにねこがいます。', zh: '房間裡有貓。' },
    ]
  },
  {
    id: 9,
    pattern: '〜で〜（場所）',
    meaning: '在～（做某事的場所）',
    category: '助詞',
    explanation: '表示動作進行的場所。',
    examples: [
      { jp: '図書館で勉強します。', reading: 'としょかんでべんきょうします。', zh: '在圖書館唸書。' },
      { jp: 'レストランで食べます。', reading: 'レストランでたべます。', zh: '在餐廳吃。' },
    ]
  },
  {
    id: 10,
    pattern: '〜で〜（手段）',
    meaning: '用～・搭～',
    category: '助詞',
    explanation: '表示方法、手段、工具或交通方式。',
    examples: [
      { jp: 'バスで行きます。', reading: 'バスでいきます。', zh: '搭公車去。' },
      { jp: '日本語で話します。', reading: 'にほんごではなします。', zh: '用日語說。' },
    ]
  },
  {
    id: 11,
    pattern: '〜へ',
    meaning: '往～方向',
    category: '助詞',
    explanation: '表示移動的方向（讀作 e），和「に」類似但更強調方向性。',
    examples: [
      { jp: '日本へ行きます。', reading: 'にほんへいきます。', zh: '去日本。' },
      { jp: '東京へ来ました。', reading: 'とうきょうへきました。', zh: '來了東京。' },
    ]
  },
  {
    id: 12,
    pattern: '〜と',
    meaning: '和～一起',
    category: '助詞',
    explanation: '表示一起做某事的對象。',
    examples: [
      { jp: '友だちと映画を見ます。', reading: 'ともだちとえいがをみます。', zh: '和朋友看電影。' },
      { jp: '家族と旅行します。', reading: 'かぞくとりょこうします。', zh: '和家人旅行。' },
    ]
  },
  {
    id: 13,
    pattern: '〜が（主語）',
    meaning: '（主詞標記）',
    category: '助詞',
    explanation: '標示句子的主語。常用於存在句、能力句、好惡句。',
    examples: [
      { jp: '猫がいます。', reading: 'ねこがいます。', zh: '有貓。' },
      { jp: '日本語が分かります。', reading: 'にほんごがわかります。', zh: '懂日語。' },
    ]
  },
  {
    id: 14,
    pattern: '〜から〜まで',
    meaning: '從～到～',
    category: '助詞',
    explanation: '表示時間或空間的起點和終點。',
    examples: [
      { jp: '九時から五時まで働きます。', reading: 'くじからごじまではたらきます。', zh: '從九點到五點工作。' },
      { jp: '東京から大阪まで新幹線で行きます。', reading: 'とうきょうからおおさかまでしんかんせんでいきます。', zh: '從東京到大阪搭新幹線去。' },
    ]
  },

  // ===== 動詞 =====
  {
    id: 15,
    pattern: '〜ます / 〜ません',
    meaning: '（禮貌肯定/否定）',
    category: '動詞',
    explanation: '動詞的禮貌形式。「ます」是肯定，「ません」是否定。',
    examples: [
      { jp: '毎日、日本語を勉強します。', reading: 'まいにち、にほんごをべんきょうします。', zh: '每天學日文。' },
      { jp: '肉を食べません。', reading: 'にくをたべません。', zh: '不吃肉。' },
    ]
  },
  {
    id: 16,
    pattern: '〜ました / 〜ませんでした',
    meaning: '（禮貌過去肯定/否定）',
    category: '動詞',
    explanation: '動詞禮貌形式的過去式。',
    examples: [
      { jp: '昨日、映画を見ました。', reading: 'きのう、えいがをみました。', zh: '昨天看了電影。' },
      { jp: '朝ご飯を食べませんでした。', reading: 'あさごはんをたべませんでした。', zh: '沒有吃早餐。' },
    ]
  },
  {
    id: 17,
    pattern: '〜ましょう',
    meaning: '一起～吧',
    category: '動詞',
    explanation: '表示邀請或提議。',
    examples: [
      { jp: '一緒に食べましょう。', reading: 'いっしょにたべましょう。', zh: '一起吃吧。' },
      { jp: '行きましょう。', reading: 'いきましょう。', zh: '走吧。' },
    ]
  },
  {
    id: 18,
    pattern: '〜ませんか',
    meaning: '要不要～？',
    category: '動詞',
    explanation: '委婉地邀請對方做某事。',
    examples: [
      { jp: '一緒に映画を見ませんか。', reading: 'いっしょにえいがをみませんか。', zh: '要不要一起看電影？' },
      { jp: 'お茶を飲みませんか。', reading: 'おちゃをのみませんか。', zh: '要不要喝茶？' },
    ]
  },
  {
    id: 19,
    pattern: '〜たい',
    meaning: '想要～',
    category: '動詞',
    explanation: '表示說話者的願望。動詞ます形去掉「ます」加「たい」。',
    examples: [
      { jp: '日本に行きたいです。', reading: 'にほんにいきたいです。', zh: '想去日本。' },
      { jp: '何が食べたいですか。', reading: 'なにがたべたいですか。', zh: '想吃什麼？' },
    ]
  },
  {
    id: 20,
    pattern: '〜て形（て/で）',
    meaning: '～然後…',
    category: '動詞',
    explanation: 'て形用來連接多個動作、表示請求等。是最重要的動詞變化之一。',
    examples: [
      { jp: '朝起きて、顔を洗います。', reading: 'あさおきて、かおをあらいます。', zh: '早上起床，洗臉。' },
      { jp: '東京に行って、買い物をしました。', reading: 'とうきょうにいって、かいものをしました。', zh: '去東京購物了。' },
    ]
  },
  {
    id: 21,
    pattern: '〜てください',
    meaning: '請～',
    category: '動詞',
    explanation: '用て形加「ください」表示請求。',
    examples: [
      { jp: 'ここに名前を書いてください。', reading: 'ここになまえをかいてください。', zh: '請在這裡寫名字。' },
      { jp: 'ちょっと待ってください。', reading: 'ちょっとまってください。', zh: '請稍等一下。' },
    ]
  },
  {
    id: 22,
    pattern: '〜ている',
    meaning: '正在～ / ～的狀態',
    category: '動詞',
    explanation: 'て形加「いる」表示進行中或持續的狀態。',
    examples: [
      { jp: '今、本を読んでいます。', reading: 'いま、ほんをよんでいます。', zh: '現在正在看書。' },
      { jp: '東京に住んでいます。', reading: 'とうきょうにすんでいます。', zh: '住在東京。' },
    ]
  },
  {
    id: 23,
    pattern: '〜てもいい',
    meaning: '可以～',
    category: '動詞',
    explanation: 'て形加「もいい」表示許可。',
    examples: [
      { jp: '写真を撮ってもいいですか。', reading: 'しゃしんをとってもいいですか。', zh: '可以拍照嗎？' },
      { jp: 'ここに座ってもいいですよ。', reading: 'ここにすわってもいいですよ。', zh: '可以坐在這裡喔。' },
    ]
  },
  {
    id: 24,
    pattern: '〜てはいけない',
    meaning: '不可以～',
    category: '動詞',
    explanation: 'て形加「はいけない」表示禁止。',
    examples: [
      { jp: 'ここで写真を撮ってはいけません。', reading: 'ここでしゃしんをとってはいけません。', zh: '不可以在這裡拍照。' },
      { jp: 'たばこを吸ってはいけません。', reading: 'たばこをすってはいけません。', zh: '不可以抽煙。' },
    ]
  },
  {
    id: 25,
    pattern: '〜ないでください',
    meaning: '請不要～',
    category: '動詞',
    explanation: '動詞ない形加「でください」表示請求不要做某事。',
    examples: [
      { jp: 'ここで食べないでください。', reading: 'ここでたべないでください。', zh: '請不要在這裡吃。' },
      { jp: '心配しないでください。', reading: 'しんぱいしないでください。', zh: '請不要擔心。' },
    ]
  },
  {
    id: 26,
    pattern: '〜たことがある',
    meaning: '曾經～過',
    category: '動詞',
    explanation: '動詞た形加「ことがある」表示經驗。',
    examples: [
      { jp: '日本に行ったことがあります。', reading: 'にほんにいったことがあります。', zh: '曾經去過日本。' },
      { jp: '寿司を食べたことがありますか。', reading: 'すしをたべたことがありますか。', zh: '吃過壽司嗎？' },
    ]
  },

  // ===== 形容詞 =====
  {
    id: 27,
    pattern: 'い形容詞 + です',
    meaning: '～（禮貌形）',
    category: '形容詞',
    explanation: 'い形容詞直接加「です」變為禮貌表現。',
    examples: [
      { jp: 'この本は面白いです。', reading: 'このほんはおもしろいです。', zh: '這本書很有趣。' },
      { jp: '今日は暑いです。', reading: 'きょうはあついです。', zh: '今天很熱。' },
    ]
  },
  {
    id: 28,
    pattern: 'い → くない（否定）',
    meaning: '不～',
    category: '形容詞',
    explanation: 'い形容詞去「い」加「くない」。',
    examples: [
      { jp: 'この映画は面白くないです。', reading: 'このえいがはおもしろくないです。', zh: '這部電影不有趣。' },
      { jp: '高くないです。', reading: 'たかくないです。', zh: '不貴。' },
    ]
  },
  {
    id: 29,
    pattern: 'い → かった（過去）',
    meaning: '（過去式）曾經～',
    category: '形容詞',
    explanation: 'い形容詞去「い」加「かった」。',
    examples: [
      { jp: '昨日は寒かったです。', reading: 'きのうはさむかったです。', zh: '昨天很冷。' },
      { jp: '旅行は楽しかったです。', reading: 'りょこうはたのしかったです。', zh: '旅行很開心。' },
    ]
  },
  {
    id: 30,
    pattern: 'な形容詞 + です',
    meaning: '～（禮貌形）',
    category: '形容詞',
    explanation: 'な形容詞直接加「です」。修飾名詞時加「な」。',
    examples: [
      { jp: 'この町は静かです。', reading: 'このまちはしずかです。', zh: '這個城鎮很安靜。' },
      { jp: '元気ですか。', reading: 'げんきですか。', zh: '你好嗎？' },
    ]
  },
  {
    id: 31,
    pattern: 'な形容詞 + じゃない（否定）',
    meaning: '不～',
    category: '形容詞',
    explanation: 'な形容詞的否定形式。',
    examples: [
      { jp: '好きじゃないです。', reading: 'すきじゃないです。', zh: '不喜歡。' },
      { jp: '暇じゃないです。', reading: 'ひまじゃないです。', zh: '不空閒。' },
    ]
  },

  // ===== 存在句 =====
  {
    id: 32,
    pattern: '〜があります',
    meaning: '有～（非生物）',
    category: '存在',
    explanation: '表示非生物的存在。',
    examples: [
      { jp: '机の上に本があります。', reading: 'つくえのうえにほんがあります。', zh: '桌上有書。' },
      { jp: 'コンビニがあります。', reading: 'コンビニがあります。', zh: '有便利商店。' },
    ]
  },
  {
    id: 33,
    pattern: '〜がいます',
    meaning: '有～（生物）',
    category: '存在',
    explanation: '表示有生命的東西的存在。',
    examples: [
      { jp: '公園に子どもがいます。', reading: 'こうえんにこどもがいます。', zh: '公園裡有小孩。' },
      { jp: '猫がいます。', reading: 'ねこがいます。', zh: '有貓。' },
    ]
  },

  // ===== 指示詞 =====
  {
    id: 34,
    pattern: 'これ / それ / あれ / どれ',
    meaning: '這個/那個/那個（遠）/哪個',
    category: '指示詞',
    explanation: '指示代名詞。「これ」近說話者，「それ」近聽者，「あれ」兩者都遠。',
    examples: [
      { jp: 'これは何ですか。', reading: 'これはなんですか。', zh: '這是什麼？' },
      { jp: 'あれは富士山です。', reading: 'あれはふじさんです。', zh: '那是富士山。' },
    ]
  },
  {
    id: 35,
    pattern: 'この / その / あの / どの',
    meaning: '這個～/那個～/那個～/哪個～',
    category: '指示詞',
    explanation: '指示連體詞，後面必須接名詞。',
    examples: [
      { jp: 'この本は面白いです。', reading: 'このほんはおもしろいです。', zh: '這本書很有趣。' },
      { jp: 'どの人が先生ですか。', reading: 'どのひとがせんせいですか。', zh: '哪位是老師？' },
    ]
  },
  {
    id: 36,
    pattern: 'ここ / そこ / あそこ / どこ',
    meaning: '這裡/那裡/那裡（遠）/哪裡',
    category: '指示詞',
    explanation: '指示場所的代名詞。',
    examples: [
      { jp: 'トイレはどこですか。', reading: 'トイレはどこですか。', zh: '廁所在哪裡？' },
      { jp: 'ここは教室です。', reading: 'ここはきょうしつです。', zh: '這裡是教室。' },
    ]
  },

  // ===== 疑問詞 =====
  {
    id: 37,
    pattern: '何（なに/なん）',
    meaning: '什麼',
    category: '疑問詞',
    explanation: '詢問事物。在「です」「の」「で」前讀「なん」，其他讀「なに」。',
    examples: [
      { jp: '名前は何ですか。', reading: 'なまえはなんですか。', zh: '名字是什麼？' },
      { jp: '何を食べますか。', reading: 'なにをたべますか。', zh: '吃什麼？' },
    ]
  },
  {
    id: 38,
    pattern: 'いつ',
    meaning: '什麼時候',
    category: '疑問詞',
    explanation: '詢問時間。',
    examples: [
      { jp: '誕生日はいつですか。', reading: 'たんじょうびはいつですか。', zh: '生日是什麼時候？' },
      { jp: 'いつ日本に行きますか。', reading: 'いつにほんにいきますか。', zh: '什麼時候去日本？' },
    ]
  },
  {
    id: 39,
    pattern: '誰（だれ）',
    meaning: '誰',
    category: '疑問詞',
    explanation: '詢問人物。',
    examples: [
      { jp: 'あの人は誰ですか。', reading: 'あのひとはだれですか。', zh: '那個人是誰？' },
      { jp: '誰と行きますか。', reading: 'だれといきますか。', zh: '和誰去？' },
    ]
  },
  {
    id: 40,
    pattern: 'いくら',
    meaning: '多少錢',
    category: '疑問詞',
    explanation: '詢問價格。',
    examples: [
      { jp: 'これはいくらですか。', reading: 'これはいくらですか。', zh: '這個多少錢？' },
      { jp: '全部でいくらですか。', reading: 'ぜんぶでいくらですか。', zh: '全部多少錢？' },
    ]
  },

  // ===== 句型 =====
  {
    id: 41,
    pattern: '〜が好きです',
    meaning: '喜歡～',
    category: '句型',
    explanation: '表示喜好。注意助詞用「が」不用「を」。',
    examples: [
      { jp: '音楽が好きです。', reading: 'おんがくがすきです。', zh: '喜歡音樂。' },
      { jp: '何が好きですか。', reading: 'なにがすきですか。', zh: '喜歡什麼？' },
    ]
  },
  {
    id: 42,
    pattern: '〜が上手です / 下手です',
    meaning: '擅長～ / 不擅長～',
    category: '句型',
    explanation: '表示能力的好壞。',
    examples: [
      { jp: '料理が上手です。', reading: 'りょうりがじょうずです。', zh: '擅長做菜。' },
      { jp: '歌が下手です。', reading: 'うたがへたです。', zh: '不擅長唱歌。' },
    ]
  },
  {
    id: 43,
    pattern: '〜が分かります',
    meaning: '懂～',
    category: '句型',
    explanation: '表示理解、懂得。助詞用「が」。',
    examples: [
      { jp: '日本語が少し分かります。', reading: 'にほんごがすこしわかります。', zh: '稍微懂一點日語。' },
      { jp: '英語が分かりますか。', reading: 'えいごがわかりますか。', zh: '懂英語嗎？' },
    ]
  },
  {
    id: 44,
    pattern: '〜に〜をあげる',
    meaning: '給～（東西）',
    category: '句型',
    explanation: '表示贈送。「に」標示接收者。',
    examples: [
      { jp: '友だちにプレゼントをあげました。', reading: 'ともだちにプレゼントをあげました。', zh: '給了朋友禮物。' },
    ]
  },
  {
    id: 45,
    pattern: '〜に〜をもらう',
    meaning: '從～得到（東西）',
    category: '句型',
    explanation: '表示收到。「に」或「から」標示給予者。',
    examples: [
      { jp: '母に本をもらいました。', reading: 'ははにほんをもらいました。', zh: '從媽媽那裡得到了書。' },
    ]
  },
  {
    id: 46,
    pattern: '〜は〜より〜',
    meaning: '～比～更～',
    category: '句型',
    explanation: '比較句型。「より」表示比較的對象。',
    examples: [
      { jp: '夏は冬より暑いです。', reading: 'なつはふゆよりあついです。', zh: '夏天比冬天熱。' },
      { jp: '電車はバスより速いです。', reading: 'でんしゃはバスよりはやいです。', zh: '電車比公車快。' },
    ]
  },
  {
    id: 47,
    pattern: '〜の中で〜が一番',
    meaning: '在～之中，～最～',
    category: '句型',
    explanation: '最高級的表現方式。',
    examples: [
      { jp: '果物の中でりんごが一番好きです。', reading: 'くだもののなかでりんごがいちばんすきです。', zh: '水果之中最喜歡蘋果。' },
    ]
  },
  {
    id: 48,
    pattern: '〜つもりです',
    meaning: '打算～',
    category: '句型',
    explanation: '表示計劃或意圖。動詞辞書形＋つもりです。',
    examples: [
      { jp: '来年、日本に行くつもりです。', reading: 'らいねん、にほんにいくつもりです。', zh: '打算明年去日本。' },
    ]
  },
  {
    id: 49,
    pattern: '〜前に',
    meaning: '在～之前',
    category: '句型',
    explanation: '表示在某動作之前。動詞辞書形＋前に。',
    examples: [
      { jp: '寝る前に歯を磨きます。', reading: 'ねるまえにはをみがきます。', zh: '睡覺前刷牙。' },
      { jp: '食べる前に手を洗います。', reading: 'たべるまえにてをあらいます。', zh: '吃飯前洗手。' },
    ]
  },
  {
    id: 50,
    pattern: '〜た後で',
    meaning: '在～之後',
    category: '句型',
    explanation: '表示在某動作之後。動詞た形＋後で。',
    examples: [
      { jp: '食べた後で、散歩します。', reading: 'たべたあとで、さんぽします。', zh: '吃完飯之後，散步。' },
      { jp: '仕事の後で、映画を見ます。', reading: 'しごとのあとで、えいがをみます。', zh: '工作之後看電影。' },
    ]
  },
];
