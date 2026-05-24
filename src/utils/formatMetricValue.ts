/** 按接口数值原样展示，不做 toFixed 四舍五入（仅消除浮点噪声） */
export function formatMetricValue(value: number): string {
    if (!Number.isFinite(value)) return '0';
    if (Object.is(value, -0)) return '0';

    const cleaned = parseFloat(value.toPrecision(12));
    return String(cleaned);
}
