"use client"

import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

import { formatCompact, formatMoney } from "@/lib/formatters"
import type { MonthStat } from "@/lib/types/analytics"

const TICK = { fill: "var(--text-secondary)", fontSize: 12 }

export function MonthlyChart({
    title,
    description,
    data,
    dataKey,
    kind,
    money = false,
    seriesLabel,
}: {
    title: string
    description: string
    data: MonthStat[]
    dataKey: "bookings" | "revenue"
    kind: "bar" | "line"
    /** Format values as ৳ amounts. */
    money?: boolean
    seriesLabel: string
}) {
    const format = (value: number) => (money ? formatMoney(value) : String(value))
    const isEmpty = data.every((item) => item[dataKey] === 0)

    const shared = (
        <>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
                dataKey="label"
                tick={TICK}
                tickLine={false}
                axisLine={{ stroke: "var(--border)" }}
                tickFormatter={(label: string) => label.slice(0, 3)}
            />
            <YAxis
                tick={TICK}
                tickLine={false}
                axisLine={false}
                width={52}
                allowDecimals={false}
                tickFormatter={(value: number) => formatCompact(value)}
            />
            <Tooltip
                cursor={{ fill: "var(--elevated)", opacity: 0.6 }}
                contentStyle={{
                    background: "var(--elevated)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--text)",
                }}
                labelStyle={{ color: "var(--text)", fontWeight: 600 }}
                itemStyle={{ color: "var(--text-secondary)" }}
                formatter={(value) => [format(Number(value)), seriesLabel]}
            />
        </>
    )

    return (
        <section className="surface-card p-6">
            <h2 className="font-heading text-lg font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-fg-secondary">{description}</p>

            <div
                className="mt-6 h-72"
                role="img"
                aria-label={`${title}: ${data
                    .map((item) => `${item.label} ${format(item[dataKey])}`)
                    .join(", ")}`}
            >
                <ResponsiveContainer width="100%" height="100%">
                    {kind === "bar" ? (
                        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                            {shared}
                            <Bar
                                dataKey={dataKey}
                                fill="var(--brand)"
                                radius={[6, 6, 0, 0]}
                                maxBarSize={44}
                            />
                        </BarChart>
                    ) : (
                        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                            {shared}
                            <Line
                                dataKey={dataKey}
                                type="monotone"
                                stroke="var(--info)"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "var(--info)", strokeWidth: 0 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>

            {isEmpty ? (
                <p className="mt-3 text-sm text-fg-muted">
                    No paid bookings in the last 6 months yet.
                </p>
            ) : null}

            {/* The same numbers for screen readers. */}
            <table className="sr-only">
                <caption>{title}</caption>
                <thead>
                    <tr>
                        <th scope="col">Month</th>
                        <th scope="col">{seriesLabel}</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.month}>
                            <th scope="row">{item.label}</th>
                            <td>{format(item[dataKey])}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    )
}