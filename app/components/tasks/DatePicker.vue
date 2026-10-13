<template>
  <div
    class="field"
    @keydown.esc="onFieldEscape"
  >
    <label
      :for="id"
      class="lbl"
    >{{ label }}</label>
    <div
      ref="anchorRef"
      class="control"
    >
      <input
        :id="id"
        ref="inputRef"
        :value="text"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        :placeholder="placeholder"
        :aria-invalid="!!errorText"
        :aria-describedby="errorText ? `${id}-err` : undefined"
        @input="onInput"
        @blur="validate"
        @keydown="onInputKeydown"
      />
      <button
        type="button"
        class="icon-btn"
        :aria-label="openLabel"
        :title="openLabel"
        aria-haspopup="dialog"
        :aria-expanded="open"
        @click="open ? closePicker(true) : openPicker()"
      >
        <Icon :name="withTime ? 'lucide:calendar-clock' : 'lucide:calendar'" />
      </button>
    </div>
    <p
      v-if="errorText"
      :id="`${id}-err`"
      class="err"
      role="alert"
    >
      {{ errorText }}
    </p>

    <Teleport to="body">
      <div
        v-if="open"
        ref="popRef"
        class="pk"
        :style="popStyle"
        role="dialog"
        :aria-label="label"
        @keydown="onPopKeydown"
        @focusout="onPopFocusout"
      >
        <div :class="['pk-body', { timed: withTime }]">
          <section :aria-label="$t('taskForm.picker.calendar')">
            <div class="cal-head">
              <button
                type="button"
                class="cal-title"
                :aria-expanded="mode === 'months'"
                :aria-label="$t('taskForm.picker.chooseMonthYear')"
                @click="toggleMode"
              >
                <span>{{ calTitle }}</span>
                <Icon name="lucide:chevron-down" />
              </button>
              <div class="cal-nav">
                <button
                  type="button"
                  class="icon-btn"
                  :disabled="!canGoPrev"
                  :aria-label="
                    mode === 'days'
                      ? $t('taskForm.picker.prevMonth')
                      : $t('taskForm.picker.prevYear')
                  "
                  @click="stepView(-1)"
                >
                  <Icon name="lucide:chevron-left" />
                </button>
                <button
                  type="button"
                  class="icon-btn"
                  :aria-label="
                    mode === 'days'
                      ? $t('taskForm.picker.nextMonth')
                      : $t('taskForm.picker.nextYear')
                  "
                  @click="stepView(1)"
                >
                  <Icon name="lucide:chevron-right" />
                </button>
              </div>
            </div>

            <div v-if="mode === 'days'">
              <div
                class="wd-row"
                aria-hidden="true"
              >
                <span
                  v-for="(w, j) in weekdayLabels"
                  :key="j"
                >{{ w }}</span>
              </div>
              <div
                class="days"
                role="group"
                :aria-label="calTitle"
              >
                <button
                  v-for="d in days"
                  :key="keyOf(d)"
                  type="button"
                  :class="['day', { out: d.getMonth() !== view.getMonth() }]"
                  :disabled="isDayDisabled(d)"
                  :tabindex="sameDay(d, focusDate) ? 0 : -1"
                  :aria-label="longFmt.format(d)"
                  :aria-pressed="sameDay(d, value)"
                  :aria-current="sameDay(d, new Date()) ? 'date' : undefined"
                  @click="pickDay(d)"
                >
                  {{ d.getDate() }}
                </button>
              </div>
            </div>
            <div
              v-else
              class="months"
              role="group"
              :aria-label="String(view.getFullYear())"
            >
              <button
                v-for="(m, j) in monthsShort"
                :key="j"
                type="button"
                class="mon"
                :disabled="isMonthDisabled(j)"
                :aria-pressed="
                  !!value
                    && value.getFullYear() === view.getFullYear()
                    && value.getMonth() === j
                "
                @click="pickMonth(j)"
              >
                {{ m }}
              </button>
            </div>
          </section>

          <section
            v-if="withTime"
            class="time"
            :aria-label="$t('taskForm.picker.time')"
          >
            <div class="time-read">
              <Icon name="lucide:clock" />
              <output>{{ pad(hour) }}:{{ pad(minute) }}</output>
            </div>
            <div class="time-cols">
              <div class="tcol-wrap">
                <span
                  :id="`${id}-hl`"
                  class="tlab"
                >{{ $t("taskForm.picker.hour") }}</span>
                <div
                  ref="hourCol"
                  class="tcol"
                  data-col="h"
                  role="listbox"
                  tabindex="0"
                  :aria-labelledby="`${id}-hl`"
                  :aria-activedescendant="`${id}-h${hour}`"
                >
                  <div
                    v-for="h in hours"
                    :id="`${id}-h${h}`"
                    :key="h"
                    class="topt"
                    role="option"
                    :aria-selected="h === hour"
                    :aria-disabled="h < minHour()"
                    @click="pickHour(h)"
                  >
                    {{ pad(h) }}
                  </div>
                </div>
              </div>
              <div class="tcol-wrap">
                <span
                  :id="`${id}-ml`"
                  class="tlab"
                >{{ $t("taskForm.picker.minute") }}</span>
                <div
                  ref="minuteCol"
                  class="tcol"
                  data-col="m"
                  role="listbox"
                  tabindex="0"
                  :aria-labelledby="`${id}-ml`"
                  :aria-activedescendant="`${id}-m${minute}`"
                >
                  <div
                    v-for="m in minutes"
                    :id="`${id}-m${m}`"
                    :key="m"
                    class="topt"
                    role="option"
                    :aria-selected="m === minute"
                    :aria-disabled="m < minMinute(hour)"
                    @click="pickMinute(m)"
                  >
                    {{ pad(m) }}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="pk-foot">
          <button
            type="button"
            class="link-btn"
            @click="clearValue"
          >
            {{ $t("taskForm.picker.clear") }}
          </button>
          <button
            type="button"
            class="link-btn"
            @click="pickNow"
          >
            {{
              withTime ? $t("taskForm.picker.now") : $t("taskForm.picker.today")
            }}
          </button>
          <template v-if="withTime">
            <span class="grow" />
            <button
              type="button"
              class="done-btn"
              @click="closePicker(true)"
            >
              {{ $t("taskForm.picker.done") }}
            </button>
          </template>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string;
  label: string;
  modelValue: string;
  withTime?: boolean;
  placeholder?: string;
  align?: "left" | "right";
  minuteStep?: number;
  weekStart?: 0 | 1;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  withTime: false,
  placeholder: "",
  align: "left",
  minuteStep: 15,
  weekStart: 1,
  error: "",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  "update:invalid": [value: boolean];
}>();

const { t, locale } = useI18n();

const pad = (n: number) => String(n).padStart(2, "0");
const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());
const sameDay = (a: Date | null, b: Date | null) =>
  !!a
  && !!b
  && a.getFullYear() === b.getFullYear()
  && a.getMonth() === b.getMonth()
  && a.getDate() === b.getDate();
const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0,
  ).getDate();
  target.setDate(Math.min(d.getDate(), last));
  return target;
};
const keyOf = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtDate = (d: Date) =>
  `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
const fmtText = (d: Date) =>
  props.withTime
    ? `${fmtDate(d)}, ${pad(d.getHours())}:${pad(d.getMinutes())}`
    : fmtDate(d);
const toModel = (d: Date | null) => {
  if (!d) return "";
  return props.withTime
    ? `${keyOf(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`
    : keyOf(d);
};
const fromModel = (s: string): Date | null => {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);
  if (!m) return null;
  return new Date(+m[1]!, +m[2]! - 1, +m[3]!, +(m[4] ?? 0), +(m[5] ?? 0));
};
const parseText = (raw: string): Date | null => {
  const m = raw
    .trim()
    .match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,?\s*(\d{1,2}):(\d{2}))?$/);
  if (!m) return null;
  if (props.withTime && m[4] == null) return null;
  if (!props.withTime && m[4] != null) return null;
  const d = +m[1]!;
  const mo = +m[2]!;
  const y = +m[3]!;
  const h = props.withTime ? +m[4]! : 0;
  const mi = props.withTime ? +m[5]! : 0;
  const dt = new Date(y, mo - 1, d, h, mi);
  if (
    dt.getFullYear() !== y
    || dt.getMonth() !== mo - 1
    || dt.getDate() !== d
    || h > 23
    || mi > 59
  ) {
    return null;
  }
  return dt;
};
const maskText = (v: string) => {
  const dg = v.replace(/\D/g, "").slice(0, props.withTime ? 12 : 8);
  let o = dg.slice(0, 2);
  if (dg.length > 2) o += `/${dg.slice(2, 4)}`;
  if (dg.length > 4) o += `/${dg.slice(4, 8)}`;
  if (props.withTime && dg.length > 8) o += `, ${dg.slice(8, 10)}`;
  if (props.withTime && dg.length > 10) o += `:${dg.slice(10, 12)}`;
  return o;
};
const floorMinute = (d: Date) =>
  new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
  );
const ceilNow = () => {
  const f = floorMinute(new Date());
  const rem = f.getMinutes() % props.minuteStep;
  return rem ? new Date(f.getTime() + (props.minuteStep - rem) * 60000) : f;
};
const roundedNow = () => {
  const c = ceilNow();
  return { h: c.getHours(), m: c.getMinutes() };
};
const isPast = (d: Date) =>
  props.withTime
    ? d.getTime() < floorMinute(new Date()).getTime()
    : d.getTime() < startOfDay(new Date()).getTime();
const pastMessage = (d: Date) =>
  props.withTime && sameDay(d, new Date())
    ? t("taskForm.pastTimeError")
    : t("taskForm.pastDateError");

const intlLocale = computed(() => (locale.value === "pt" ? "pt-BR" : "en-GB"));
const monthsLong = computed(() =>
  Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(intlLocale.value, { month: "long" }).format(
      new Date(2026, i, 1),
    ),
  ),
);
const monthsShort = computed(() =>
  Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(intlLocale.value, { month: "short" }).format(
      new Date(2026, i, 1),
    ),
  ),
);
const weekdayLabels = computed(() =>
  Array.from({ length: 7 }, (_, j) =>
    new Intl.DateTimeFormat(intlLocale.value, { weekday: "narrow" }).format(
      new Date(2026, 9, 4 + ((props.weekStart + j) % 7)),
    ),
  ),
);
const longFmt = computed(
  () =>
    new Intl.DateTimeFormat(intlLocale.value, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
);

const text = ref("");
const value = ref<Date | null>(null);
const formatError = ref("");
const open = ref(false);
const mode = ref<"days" | "months">("days");
const view = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
const focusDate = ref(startOfDay(new Date()));
const hour = ref(roundedNow().h);
const minute = ref(roundedNow().m);
const popStyle = ref<Record<string, string>>({
  left: "0px",
  top: "0px",
  visibility: "hidden",
});

const anchorRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const popRef = ref<HTMLElement | null>(null);
const hourCol = ref<HTMLElement | null>(null);
const minuteCol = ref<HTMLElement | null>(null);

const errorText = computed(() => formatError.value || props.error);
const openLabel = computed(() =>
  props.withTime
    ? t("taskForm.picker.openDateTime", { label: props.label })
    : t("taskForm.picker.openDate", { label: props.label }),
);
const calTitle = computed(() =>
  mode.value === "days"
    ? `${monthsLong.value[view.value.getMonth()]} ${view.value.getFullYear()}`
    : String(view.value.getFullYear()),
);
const days = computed(() => {
  const first = new Date(view.value.getFullYear(), view.value.getMonth(), 1);
  const start = addDays(first, -((first.getDay() - props.weekStart + 7) % 7));
  return Array.from({ length: 42 }, (_, j) => addDays(start, j));
});
const hours = Array.from({ length: 24 }, (_, i) => i);
const minutes = computed(() => {
  const list: number[] = [];
  for (let k = 0; k < 60; k += props.minuteStep) list.push(k);
  return list;
});

watch(
  () => props.modelValue,
  (v) => {
    if (toModel(value.value) === v) return;
    const incoming = fromModel(v);
    value.value = incoming;
    text.value = incoming ? fmtText(incoming) : "";
    formatError.value
      = incoming && isPast(incoming) ? pastMessage(incoming) : "";
    if (incoming) {
      hour.value = incoming.getHours();
      minute.value = incoming.getMinutes();
    }
  },
  { immediate: true },
);

watch(
  () => !!errorText.value,
  v => emit("update:invalid", v),
  { immediate: true },
);

const commit = () => {
  text.value = value.value ? fmtText(value.value) : "";
  formatError.value = "";
  emit("update:modelValue", toModel(value.value));
};

const stepMismatch = (d: Date) =>
  props.withTime && d.getMinutes() % props.minuteStep !== 0;

const validate = () => {
  const raw = text.value.trim();
  if (!raw) {
    value.value = null;
    formatError.value = "";
    emit("update:modelValue", "");
    return;
  }
  const p = parseText(raw);
  if (p && !stepMismatch(p) && isPast(p)) {
    value.value = null;
    emit("update:modelValue", "");
    formatError.value = pastMessage(p);
    return;
  }
  if (p && !stepMismatch(p)) {
    value.value = p;
    commit();
    return;
  }
  value.value = null;
  emit("update:modelValue", "");
  formatError.value = p
    ? t("taskForm.timeStepError", { step: props.minuteStep })
    : props.withTime
      ? t("taskForm.dateTimeFormatError")
      : t("taskForm.dateFormatError");
};

const onInput = (e: Event) => {
  const el = e.target as HTMLInputElement;
  text.value = maskText(el.value);
  el.value = text.value;
  const p = parseText(text.value);
  if (p && !stepMismatch(p) && isPast(p)) {
    if (value.value) emit("update:modelValue", "");
    value.value = null;
    formatError.value = pastMessage(p);
  } else if (p && !stepMismatch(p)) {
    value.value = p;
    hour.value = p.getHours();
    minute.value = p.getMinutes();
    focusDate.value = startOfDay(p);
    view.value = new Date(p.getFullYear(), p.getMonth(), 1);
    formatError.value = "";
    emit("update:modelValue", toModel(p));
    if (open.value) nextTick(() => centerCols(false));
  } else {
    if (value.value) emit("update:modelValue", "");
    value.value = null;
  }
};

const place = () => {
  const anchor = anchorRef.value;
  const pop = popRef.value;
  if (!anchor || !pop) return;
  const ar = anchor.getBoundingClientRect();
  const pw = pop.offsetWidth;
  const ph = pop.offsetHeight;
  let left = props.align === "right" ? ar.right - pw : ar.left;
  left = Math.max(8, Math.min(left, window.innerWidth - pw - 8));
  let top = ar.bottom + 6;
  if (top + ph > window.innerHeight - 8 && ar.top - 6 - ph > 8) {
    top = ar.top - 6 - ph;
  } else if (top + ph > window.innerHeight - 8) {
    top = Math.max(8, window.innerHeight - ph - 8);
  }
  popStyle.value = {
    left: `${left}px`,
    top: `${top}px`,
    visibility: "visible",
  };
};

const centerOpt = (col: HTMLElement | null, smooth: boolean) => {
  const sel = col?.querySelector<HTMLElement>("[aria-selected=\"true\"]");
  if (!col || !sel) return;
  col.scrollTo({
    top: sel.offsetTop - (col.clientHeight - sel.offsetHeight) / 2,
    left: sel.offsetLeft - (col.clientWidth - sel.offsetWidth) / 2,
    behavior: smooth ? "smooth" : "auto",
  });
};
const centerCols = (smooth: boolean) => {
  if (!props.withTime) return;
  centerOpt(hourCol.value, smooth);
  centerOpt(minuteCol.value, smooth);
};
const focusDay = () => {
  popRef.value
    ?.querySelector<HTMLButtonElement>(".day[tabindex=\"0\"]")
    ?.focus({ preventScroll: true });
};

const refIsToday = () => sameDay(value.value ?? focusDate.value, new Date());
const minHour = () => {
  if (!props.withTime || !refIsToday()) return 0;
  const c = ceilNow();
  return sameDay(c, new Date()) ? c.getHours() : 24;
};
const minMinute = (h: number) => {
  if (!props.withTime || !refIsToday()) return 0;
  const c = ceilNow();
  if (!sameDay(c, new Date()) || h < c.getHours()) return 60;
  return h === c.getHours() ? c.getMinutes() : 0;
};
const isDayDisabled = (d: Date) =>
  d.getTime() < startOfDay(new Date()).getTime()
  || (props.withTime && sameDay(d, new Date()) && !sameDay(ceilNow(), new Date()));
const isMonthDisabled = (j: number) => {
  const n = new Date();
  return (
    view.value.getFullYear() < n.getFullYear()
    || (view.value.getFullYear() === n.getFullYear() && j < n.getMonth())
  );
};
const canGoPrev = computed(() => {
  const n = new Date();
  return mode.value === "days"
    ? view.value.getFullYear() * 12 + view.value.getMonth()
    > n.getFullYear() * 12 + n.getMonth()
    : view.value.getFullYear() > n.getFullYear();
});
const clampFocus = () => {
  let min = startOfDay(new Date());
  if (props.withTime && !sameDay(ceilNow(), min)) min = startOfDay(ceilNow());
  if (focusDate.value.getTime() < min.getTime()) focusDate.value = min;
};
const ensureValidTime = (d: Date) => {
  if (!props.withTime || !sameDay(d, new Date())) return;
  const c = ceilNow();
  if (hour.value * 60 + minute.value < c.getHours() * 60 + c.getMinutes()) {
    hour.value = c.getHours();
    minute.value = c.getMinutes();
  }
};

const openPicker = () => {
  if (open.value) return;
  const p = parseText(text.value);
  if (p && !stepMismatch(p)) {
    value.value = p;
    hour.value = p.getHours();
    minute.value = p.getMinutes();
  } else if (!value.value) {
    const r = roundedNow();
    hour.value = r.h;
    minute.value = r.m;
  }
  focusDate.value = startOfDay(value.value ?? new Date());
  clampFocus();
  if (!value.value) ensureValidTime(focusDate.value);
  view.value = new Date(
    focusDate.value.getFullYear(),
    focusDate.value.getMonth(),
    1,
  );
  mode.value = "days";
  popStyle.value = { left: "0px", top: "0px", visibility: "hidden" };
  open.value = true;
  nextTick(() => {
    place();
    centerCols(false);
    focusDay();
  });
};

const closePicker = (returnFocus: boolean) => {
  if (!open.value) return;
  open.value = false;
  if (returnFocus) inputRef.value?.focus();
};

const pickDay = (d: Date) => {
  if (isDayDisabled(d)) return;
  ensureValidTime(d);
  value.value = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    props.withTime ? hour.value : 0,
    props.withTime ? minute.value : 0,
  );
  focusDate.value = startOfDay(d);
  view.value = new Date(d.getFullYear(), d.getMonth(), 1);
  commit();
  if (props.withTime) nextTick(focusDay);
  else closePicker(true);
};

const setTime = (h: number, m: number) => {
  if (h < minHour() || m < minMinute(h)) return;
  hour.value = h;
  minute.value = m;
  const base = value.value ?? focusDate.value;
  value.value = new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate(),
    h,
    m,
  );
  focusDate.value = startOfDay(value.value);
  commit();
  nextTick(() => centerCols(true));
};

const pickHour = (h: number) => {
  if (h < minHour()) return;
  setTime(h, Math.max(minute.value, minMinute(h)));
};

const pickMinute = (m: number) => {
  if (m < minMinute(hour.value)) return;
  setTime(hour.value, m);
};

const pickNow = () => {
  const n = new Date();
  if (props.withTime) {
    const c = ceilNow();
    focusDate.value = startOfDay(c);
    view.value = new Date(c.getFullYear(), c.getMonth(), 1);
    value.value = null;
    setTime(c.getHours(), c.getMinutes());
  } else {
    pickDay(startOfDay(n));
  }
};

const clearValue = () => {
  value.value = null;
  commit();
  if (!props.withTime) closePicker(true);
};

const toggleMode = () => {
  mode.value = mode.value === "days" ? "months" : "days";
  nextTick(() => {
    if (mode.value === "days") focusDay();
    else {
      popRef.value
        ?.querySelector<HTMLButtonElement>(".mon[aria-pressed=\"true\"], .mon")
        ?.focus({ preventScroll: true });
    }
  });
};

const stepView = (dir: number) => {
  if (dir < 0 && !canGoPrev.value) return;
  if (mode.value === "days") {
    focusDate.value = addMonths(focusDate.value, dir);
    clampFocus();
    view.value = new Date(
      focusDate.value.getFullYear(),
      focusDate.value.getMonth(),
      1,
    );
  } else {
    view.value = new Date(
      view.value.getFullYear() + dir,
      view.value.getMonth(),
      1,
    );
  }
};

const pickMonth = (j: number) => {
  if (isMonthDisabled(j)) return;
  view.value = new Date(view.value.getFullYear(), j, 1);
  const last = new Date(view.value.getFullYear(), j + 1, 0).getDate();
  focusDate.value = new Date(
    view.value.getFullYear(),
    j,
    Math.min(focusDate.value.getDate(), last),
  );
  clampFocus();
  mode.value = "days";
  nextTick(focusDay);
};

const onInputKeydown = (e: KeyboardEvent) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    openPicker();
  } else if (e.key === "Enter") {
    e.preventDefault();
    validate();
  }
};

const onFieldEscape = (e: Event) => {
  if (!open.value) return;
  e.preventDefault();
  e.stopPropagation();
  closePicker(true);
};

const onPopKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();
    closePicker(true);
    return;
  }
  const target = e.target as HTMLElement;
  const col = target.closest<HTMLElement>(".tcol");
  if (col) {
    const isHour = col.dataset.col === "h";
    const cur = isHour ? hour.value : minute.value;
    const max = isHour ? 23 : 59;
    const step = isHour ? 1 : props.minuteStep;
    let nv = cur;
    if (e.key === "ArrowUp") nv = cur - step;
    else if (e.key === "ArrowDown") nv = cur + step;
    else if (e.key === "PageUp") nv = cur - (isHour ? 6 : step * 4);
    else if (e.key === "PageDown") nv = cur + (isHour ? 6 : step * 4);
    else if (e.key === "Home") nv = 0;
    else if (e.key === "End") nv = isHour ? 23 : 60 - step;
    else return;
    e.preventDefault();
    const lower = isHour ? minHour() : minMinute(hour.value);
    nv = Math.max(lower, Math.min(max, nv));
    if (isHour) pickHour(nv);
    else pickMinute(nv);
    return;
  }
  if (!target.classList.contains("day")) return;
  const offset = (focusDate.value.getDay() - props.weekStart + 7) % 7;
  const moves: Record<string, number> = {
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -7,
    ArrowDown: 7,
  };
  if (moves[e.key] !== undefined)
    focusDate.value = addDays(focusDate.value, moves[e.key]!);
  else if (e.key === "Home")
    focusDate.value = addDays(focusDate.value, -offset);
  else if (e.key === "End")
    focusDate.value = addDays(focusDate.value, 6 - offset);
  else if (e.key === "PageUp")
    focusDate.value = addMonths(focusDate.value, e.shiftKey ? -12 : -1);
  else if (e.key === "PageDown")
    focusDate.value = addMonths(focusDate.value, e.shiftKey ? 12 : 1);
  else return;
  e.preventDefault();
  clampFocus();
  view.value = new Date(
    focusDate.value.getFullYear(),
    focusDate.value.getMonth(),
    1,
  );
  nextTick(focusDay);
};

const onPopFocusout = (e: FocusEvent) => {
  const to = e.relatedTarget as Node | null;
  if (
    open.value
    && to
    && !popRef.value?.contains(to)
    && !anchorRef.value?.contains(to)
  ) {
    closePicker(false);
  }
};

const onDocPointerDown = (e: PointerEvent) => {
  if (!open.value) return;
  const target = e.target as Node;
  if (popRef.value?.contains(target) || anchorRef.value?.contains(target))
    return;
  closePicker(false);
};

const onViewportChange = () => {
  if (open.value) place();
};

onMounted(() => {
  document.addEventListener("pointerdown", onDocPointerDown);
  window.addEventListener("resize", onViewportChange);
  document.addEventListener("scroll", onViewportChange, true);
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocPointerDown);
  window.removeEventListener("resize", onViewportChange);
  document.removeEventListener("scroll", onViewportChange, true);
});
</script>

<style scoped>
.field {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.lbl {
  font-weight: 700;
  color: var(--color-text-primary);
}

.control {
  position: relative;
  display: flex;
  align-items: center;
}

.control input {
  width: 100%;
  min-height: 44px;
  padding: 10px 52px 10px 15px;
  font: inherit;
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  transition: all 0.2s ease;
}

.control input::placeholder {
  color: var(--color-text-secondary);
}

.control input:hover {
  border-color: var(--color-border-strong);
}

.control input:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 1px;
  border-color: var(--color-accent);
}

.control input[aria-invalid="true"] {
  border-color: var(--color-danger);
}

.icon-btn {
  width: 40px;
  height: 40px;
  display: inline-grid;
  place-items: center;
  flex: none;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.control .icon-btn {
  position: absolute;
  right: 3px;
}

.icon-btn:hover:not(:disabled) {
  background: var(--color-accent-soft);
}

.icon-btn:disabled,
.day:disabled,
.mon:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.icon-btn:focus-visible,
.link-btn:focus-visible,
.done-btn:focus-visible,
.cal-title:focus-visible,
.day:focus-visible,
.mon:focus-visible,
.tcol:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}

.icon-btn :deep(svg) {
  width: 20px;
  height: 20px;
}

.err {
  margin: 0;
  font-size: 14px;
  color: var(--color-danger);
}

.pk {
  position: fixed;
  z-index: 1100;
  padding: 8px 10px;
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  box-shadow: 0 18px 48px rgba(12, 32, 26, 0.22);
}

.pk-body {
  display: grid;
  gap: 10px;
  grid-template-columns: 252px;
}

.pk-body.timed {
  grid-template-columns: 252px;
}

.pk-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid var(--color-border);
}

.grow {
  flex: 1;
}

.link-btn {
  min-height: 34px;
  padding: 2px 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--color-accent);
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.link-btn:hover {
  background: var(--color-accent-soft);
}

.done-btn {
  min-height: 34px;
  padding: 2px 16px;
  border: 1px solid var(--color-accent);
  border-radius: 10px;
  background: var(--color-accent);
  color: var(--color-on-accent);
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.done-btn:hover {
  opacity: 0.9;
}

.cal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  margin-bottom: 2px;
}

.pk .icon-btn {
  width: 32px;
  height: 32px;
}

.pk .icon-btn :deep(svg) {
  width: 18px;
  height: 18px;
}

.cal-title {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 32px;
  padding: 2px 8px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  text-transform: capitalize;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cal-title:hover {
  background: var(--color-accent-soft);
}

.cal-title :deep(svg) {
  width: 14px;
  height: 14px;
  transition: rotate 0.2s ease;
}

.cal-title[aria-expanded="true"] :deep(svg) {
  rotate: 180deg;
}

.cal-nav {
  display: flex;
  gap: 2px;
}

.wd-row,
.days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 1px;
}

.wd-row span {
  height: 24px;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.day {
  height: 34px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-primary);
  font: inherit;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: all 0.2s ease;
}

.day.out {
  color: var(--color-text-secondary);
  opacity: 0.75;
}

.day:hover:not(:disabled) {
  background: var(--color-accent-soft);
}

.day[aria-current="date"] {
  box-shadow: inset 0 0 0 1.5px var(--color-accent);
}

.day[aria-pressed="true"] {
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-weight: 700;
  opacity: 1;
}

.months {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 4px;
  padding-top: 4px;
}

.mon {
  height: 44px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  font: inherit;
  font-weight: 700;
  text-transform: capitalize;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mon:hover:not(:disabled) {
  border-color: var(--color-accent);
  background: var(--color-accent-soft);
}

.mon[aria-pressed="true"] {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: var(--color-on-accent);
}

.time {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 4px;
  min-width: 0;
}

.time-read {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 26px;
  font-size: 17px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.02em;
}

.time-read :deep(svg) {
  width: 18px;
  height: 18px;
  color: var(--color-accent);
}

.time-cols {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 4px;
  min-height: 0;
}

.tcol-wrap {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.tlab {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-secondary);
}

.tcol {
  position: relative;
  height: 40px;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  padding: 4px 80px;
  border-radius: 10px;
  background: var(--color-muted-bg);
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
}

.topt {
  flex: none;
  min-width: 38px;
  height: 32px;
  margin-inline: 1px;
  padding-inline: 4px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  scroll-snap-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.topt:hover:not([aria-disabled="true"]) {
  background: var(--color-accent-soft);
}

.topt[aria-disabled="true"] {
  opacity: 0.35;
  cursor: not-allowed;
}

.topt[aria-selected="true"] {
  background: var(--color-accent);
  color: var(--color-on-accent);
  font-weight: 700;
}

@media (min-width: 460px) {
  .pk-body.timed {
    grid-template-columns: 252px 116px;
  }

  .time {
    gap: 2px;
  }

  .time-read {
    min-height: 32px;
    font-size: 19px;
  }

  .time-cols {
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .tcol-wrap {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto 1fr;
    align-items: stretch;
    gap: 2px;
  }

  .tlab {
    text-align: center;
  }

  .tcol {
    height: 176px;
    display: block;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 72px 0;
    scroll-snap-type: y mandatory;
  }

  .tcol[data-col="m"] {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 0;
    scroll-snap-type: none;
  }

  .topt {
    height: 32px;
    min-width: 0;
    margin-inline: 3px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .control input,
  .icon-btn,
  .link-btn,
  .done-btn,
  .cal-title,
  .cal-title :deep(svg),
  .day,
  .mon,
  .topt {
    transition: none;
  }

  .tcol {
    scroll-behavior: auto;
  }
}
</style>
