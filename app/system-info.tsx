'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

async function fetchSystemInfo() {
    const response = await fetch('/api')
    return response.json()
}

type SystemInfo = {
    systemInfo: {
        hostname: string;
        platform: string;
        arch: string;
    };
    cpuTemp: number;
    cpuUsage: string[];
    memoryUsage: {
        total: number;
        used: number;
        free: number;
    };
    diskSpace: {
        total: string;
        used: string;
        available: string;
    };
}

export function SystemInfo() {
    const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)

    useEffect(() => {
        const updateInfo = async () => {
            const info = await fetchSystemInfo()
            setSystemInfo(info)
        }

        updateInfo()
        const interval = setInterval(updateInfo, 5000) // Alle 5 Sekunden aktualisieren

        return () => clearInterval(interval)
    }, [])

    if (!systemInfo) return <div>Loading...</div>

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    {[
                        ["Hostname", systemInfo.systemInfo.hostname],
                        ["Platform", systemInfo.systemInfo.platform],
                        ["Architecture", systemInfo.systemInfo.arch],
                        ["CPU Temperature", `${systemInfo.cpuTemp.toFixed(1)}°C`],
                        ["Disk Space", `${systemInfo.diskSpace.used} / ${systemInfo.diskSpace.total}`],
                    ].map(([label, value]) => (
                        <div key={label} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">{label}:</span>
                            <span className="text-foreground font-medium">{value}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">CPU Usage</h3>
                    {systemInfo.cpuUsage.map((usage, index) => (
                        <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>Core {index}</span>
                                <span>{usage}%</span>
                            </div>
                            <Progress value={parseFloat(usage)} className="h-2" />
                        </div>
                    ))}
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">RAM Usage</h3>
                    <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Used</span>
                        <span>{systemInfo.memoryUsage.used.toFixed(2)} / {systemInfo.memoryUsage.total.toFixed(2)} GB</span>
                    </div>
                    <Progress
                        value={(systemInfo.memoryUsage.used / systemInfo.memoryUsage.total) * 100}
                        className="h-2"
                    />
                </div>
            </CardContent>
        </Card>
    )
}