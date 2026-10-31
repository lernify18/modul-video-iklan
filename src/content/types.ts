export type OS = 'mac' | 'win'
export type Mode = 'tutor' | 'latih'
export type Tone = 'lav' | 'pink' | 'sky' | 'mint' | 'butter' | 'peach'
export type IconName = 'pin' | 'bulb' | 'lock' | 'medal' | 'warn' | 'laptop' | 'yes' | 'no'
  | 'chat' | 'mic' | 'caption' | 'phone' | 'doc' | 'zoom' | 'target' | 'film' | 'grid' | 'hook' | 'click' | 'svg'
  | 'layers' | 'flare' | 'gear' | 'video' | 'table' | 'folder' | 'flag' | 'browser' | 'type' | 'tab' | 'code'

/** x, y, width, height — percentages of the screenshot. */
export type Rect = readonly [number, number, number, number]

export interface Label {
  readonly at: readonly [number, number]
  readonly text: string
}

/** One screen the learner clicks on, as it looks on one operating system. */
export interface ShotView {
  readonly img: string
  /**
   * 'browser' draws an address bar with `url`; 'window' draws a plain app window; 'screen' draws nothing, for a
   * capture that already shows its own window (a Finder window, a Windows desktop).
   */
  readonly frame: 'browser' | 'window' | 'screen'
  /** Width over height of the picture; screens that are not 16:10 (a Finder window, a dialog) keep their shape. */
  readonly ratio?: number
  readonly url?: string
  readonly caption: string
  readonly say: string
  readonly target: Rect
  /** The area the camera zooms to; must contain `target`. */
  readonly focus: Rect
  readonly hints: readonly [string, string]
  readonly ok: string
  readonly labels?: readonly Label[]
  readonly vo?: string
  /** A rebuilt Windows screen, not a capture; shown with its own label. */
  readonly dummy?: boolean
  /** Which screen this is, and which screen the click opens; strict chapters must chain with no gap. */
  readonly screen?: string
  readonly leadsTo?: string
}

/**
 * One step of an infographic: a 3D icon, a short title and a line under it. `at` is the voice cue (the n-th {klik}
 * in the page's voice script, from 0) that lights it; a step without one lights in turn while the voice plays.
 */
export interface InfoStep {
  readonly icon: IconName
  readonly title: string
  readonly sub?: string
  readonly at?: number
}

export interface Bar {
  readonly label: string
  readonly sub?: string
  readonly value: number
  /** The number as printed on the bar. */
  readonly shown: string
  /** The small figure beside the bar. */
  readonly pill: string
  readonly at?: number
}

export interface VsSide {
  readonly title: string
  readonly tag: string
  readonly pick?: boolean
  readonly rows: readonly { readonly ok: boolean; readonly text: string }[]
}

export type Block =
  | { readonly t: 'p'; readonly text: string }
  | { readonly t: 'lead'; readonly text: string }
  /** `parts` colours the numbers like the five parts of a prompt (see the prompt block's `parts`). */
  | { readonly t: 'steps'; readonly items: readonly string[]; readonly parts?: boolean }
  | { readonly t: 'note'; readonly tone: 'tip' | 'awas' | 'privasi'; readonly title: string; readonly text: string }
  | { readonly t: 'gloss'; readonly items: readonly { readonly term: string; readonly def: string }[] }
  | { readonly t: 'vs'; readonly left: VsSide; readonly right: VsSide }
  | { readonly t: 'price'; readonly big: string; readonly text: string }
  | { readonly t: 'chips'; readonly items: readonly string[] }
  /** Case-study figures as big-number tiles. */
  | { readonly t: 'stats'; readonly items: readonly { readonly n: string; readonly label: string }[] }
  /** How proven a case study is: Ubai's own sales ('bukti') or work made for a client ('klien'). */
  | { readonly t: 'badge'; readonly text: string; readonly tone: 'bukti' | 'klien' }
  | { readonly t: 'art'; readonly icon: IconName; readonly label: string }
  /**
   * A real picture (frame from Ubai's video, a pack sample). `tall` for 9:16 phone frames, shown narrower. `left` keeps
   * it in the text column, beside a chart in the picture column.
   */
  | { readonly t: 'img'; readonly src: string; readonly alt: string; readonly caption: string; readonly tall?: boolean; readonly left?: boolean }
  | { readonly t: 'pair'; readonly items: readonly { readonly src: string; readonly alt: string; readonly tag: string; readonly caption: string }[] }
  | { readonly t: 'video'; readonly src: string; readonly poster: string; readonly caption: string }
  | { readonly t: 'table'; readonly head: readonly string[]; readonly rows: readonly (readonly string[])[]; readonly caption?: string }
  /** Someone's own words, shown as they wrote them (spelling kept). */
  | { readonly t: 'quote'; readonly text: string; readonly cite: string }
  /** A prompt the learner copies into Claude; [tempat kosong] marks what they fill in. */
  /**
   * A prompt the learner copies into Claude; [tempat kosong] marks what they fill in. `parts` labels each line with the
   * part of the formula it is. `example` is the same prompt filled in for a real ad, ==marked== where it was filled.
   * `fixed` is a long prompt pasted exactly as it is (nothing to fill in), shown in a box that scrolls.
   */
  | { readonly t: 'prompt'; readonly title: string; readonly text: string; readonly note?: string; readonly parts?: readonly string[]; readonly example?: string; readonly fixed?: boolean }
  /** Module map on an opening page: numbered stops along a drawn path. */
  | { readonly t: 'road'; readonly stops: readonly InfoStep[] }
  /** A process: steps joined by arrows. `left` keeps it in the text column of a page that has a picture. */
  | { readonly t: 'flow'; readonly title?: string; readonly steps: readonly InfoStep[]; readonly left?: boolean }
  /** A yes/no choice drawn as a small tree. */
  | { readonly t: 'tree'; readonly title?: string; readonly q: string; readonly sub?: string; readonly at?: number; readonly yes: InfoStep; readonly no: InfoStep }
  /** Picture tiles, one per term or part. */
  | { readonly t: 'tiles'; readonly title?: string; readonly items: readonly InfoStep[]; readonly cols?: number }
  /** Real numbers as 3D bars. */
  | { readonly t: 'bars'; readonly title: string; readonly rows: readonly Bar[]; readonly legend: readonly string[] }
  /** Steps around a ring, for "repeat until it is right". */
  | { readonly t: 'loop'; readonly centre: string; readonly at?: number; readonly nodes: readonly InfoStep[] }
  /** What the reader can do after this module. */
  | { readonly t: 'outcome'; readonly text: string }
  /** A file the reader downloads (the Pro skill): one big button with its size and version, then the next step. */
  | { readonly t: 'download'; readonly href: string; readonly label: string; readonly meta: string; readonly next: string }

export interface Question {
  readonly q: string
  readonly options: readonly string[]
  /** A 3D icon in front of each option. */
  readonly icons?: readonly IconName[]
  readonly answer: number
  readonly hint: string
}

export interface SpotItem {
  readonly name: string
  readonly q: string
  readonly rects: readonly Rect[]
  readonly why: string
  readonly hint: string
  /** How this part works, shown as a small process under its name in the legend. */
  readonly flow?: readonly InfoStep[]
  /** A frame of its own when this part is best seen in another scene; the page's frame otherwise. */
  readonly img?: string
  readonly alt?: string
}

/** Basic gets the short skill iklan-video; Pro also gets Ubai's skill ubai-videoads (Ubai, 30 Okt 2026). */
export type Pakej = 'basic' | 'pro'

interface PageBase {
  readonly id: string
  readonly kicker: string
  readonly tone?: Tone
  readonly title?: string
  readonly footnotes?: readonly string[]
  readonly keynote: string
  readonly vo?: string
  /** Shown only to readers on this computer (installing differs on a Mac and on Windows). */
  readonly os?: OS
  /** 'basic': a Basic reader's page only (the short skill). 'pro': a Pro reader's page only. */
  readonly pakej?: Pakej
  /** A Pro page a Basic reader still sees, locked, as the one preview of what Pro adds. */
  readonly kunci?: boolean
}

/**
 * A step done with the keyboard or by typing (an address, a shortcut), not by clicking the screen before. In a
 * click-to-click chapter it joins screen `from` to screen `to`, so the chain stays unbroken and nothing is skipped.
 */
export interface Bridge {
  readonly from: string
  readonly to: string
}

export type Page =
  | (PageBase & { readonly kind: 'explain'; readonly cover?: boolean; readonly bridge?: Bridge; readonly blocks: readonly Block[] })
  | (PageBase & { readonly kind: 'shot'; readonly views: Readonly<Record<OS, ShotView>> })
  | (PageBase & { readonly kind: 'check'; readonly blocks: readonly Block[]; readonly items: readonly string[]; readonly done: string; readonly after?: readonly Block[] })
  | (PageBase & { readonly kind: 'quiz'; readonly blocks: readonly Block[]; readonly questions: readonly Question[] })
  | (PageBase & { readonly kind: 'spot'; readonly blocks: readonly Block[]; readonly img: string; readonly alt: string; readonly items: readonly SpotItem[] })

export interface Chapter {
  readonly id: string
  readonly module: number
  readonly title: string
  readonly pages: readonly Page[]
  /** Click-to-click chapter: every screen must lead to the next one shown, on Mac and on Windows. */
  readonly strict?: boolean
}

export interface VoClip {
  readonly dur: number
  readonly cues: readonly number[]
  /** Hash of the spoken text, voice and model, so tools/vo.ts only remakes clips that changed. */
  readonly hash?: string
}
