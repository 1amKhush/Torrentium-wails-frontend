import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Upload, Download, Users, TrendingUp, File, Plus, Search,
    FileUp, FileDown, Music, Video, Book, HardDrive, AppWindow
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { formatBytes } from '../lib/utils';

export function Home() {
    const { user, peers, addNotification } = useApp();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const onlinePeers = peers.filter(p => p.isOnline && !p.isBlocked).length;

    // Mock trending files data
    const trendingFiles = [
        { id: 'trend1', name: 'Ubuntu 22.04.4 LTS Desktop.iso', size: 4698415104, type: 'OS', transfers: 1247, seeders: 89, leechers: 23 },
        { id: 'trend2', name: 'Web Dev Course 2024.zip', size: 8589934592, type: 'Education', transfers: 892, seeders: 156, leechers: 45 },
        { id: 'trend3', name: 'Blender 4.0 LTS.dmg', size: 2147483648, type: 'Software', transfers: 734, seeders: 67, leechers: 12 },
        { id: 'trend4', name: 'Programming Books.rar', size: 1073741824, type: 'Books', transfers: 623, seeders: 98, leechers: 34 },
        { id: 'trend5', name: 'Adobe Suite 2024.zip', size: 12884901888, type: 'Software', transfers: 567, seeders: 43, leechers: 67 }
    ];

    const filteredTrendingFiles = trendingFiles.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = [
        { title: "Files Shared", value: user.totalShared, icon: Upload, color: "text-green-500" },
        { title: "Files Downloaded", value: user.totalDownloaded, icon: Download, color: "text-blue-500" },
        { title: "Trust Score", value: user.trustScore, icon: TrendingUp, color: "text-yellow-500" },
        { title: "Online Peers", value: onlinePeers, icon: Users, color: "text-green-500" }
    ];

    const getFileIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'os': return <HardDrive className="h-5 w-5 text-gray-500" />;
            case 'education': return <Book className="h-5 w-5 text-blue-500" />;
            case 'software': return <AppWindow className="h-5 w-5 text-green-500" />;
            case 'books': return <Book className="h-5 w-5 text-yellow-500" />;
            case 'music': return <Music className="h-5 w-5 text-red-500" />;
            case 'video': return <Video className="h-5 w-5 text-purple-500" />;
            default: return <File className="h-5 w-5 text-gray-500" />;
        }
    };

    const handleDownloadTrending = (file) => {
        addNotification(`Download Started: ${file.name}`, 'success');
        navigate('/transfers');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Welcome back, {user.username}!</h1>
                <p className="text-text-secondary mt-2">Here's what's happening with your torrents</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="my-6 p-4 bg-surface rounded-lg text-center text-text-secondary">
                Advertisement Space
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2"><FileUp className="h-5 w-5 text-green-500" /><span>Upload</span></CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate('/transfers')} className="w-full">
                            <Plus className="h-4 w-4 mr-2" /> Share Files
                        </Button>
                    </CardContent>
                </Card>
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2"><FileDown className="h-5 w-5 text-blue-500" /><span>Download</span></CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => navigate('/transfers')} className="w-full">
                            <Plus className="h-4 w-4 mr-2" /> Add Torrent
                        </Button>
                    </CardContent>
                </Card>
                <div className="lg:col-span-1 bg-surface rounded-lg flex items-center justify-center text-text-secondary">
                    Vertical Ad Space
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2"><TrendingUp className="h-5 w-5 text-yellow-500" /><span>Trending Files</span></CardTitle>
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                        <Input placeholder="Search trending files..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {filteredTrendingFiles.map((file, index) => (
                            <div key={file.id} className="flex items-center justify-between p-3 rounded-lg bg-background/40 hover:bg-surface transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2">
                                            <p className="font-medium truncate">{file.name}</p>
                                            <Button onClick={() => handleDownloadTrending(file)} size="sm">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center space-x-3 text-sm text-text-secondary">
                                            {getFileIcon(file.type)}
                                            <span>{formatBytes(file.size)}</span>
                                            <span className="text-green-500">{file.seeders}s</span>
                                            <span className="text-red-500">{file.leechers}l</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}