import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Paper,
  Grid,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
  Skeleton,
  Alert,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  InsertDriveFile as FileIcon,
  CalendarToday as CalendarIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon,
  TableChart as TableChartIcon,
  BubbleChart as ScatterIcon,
  GridOn as HeatmapIcon,
  ZoomIn as ZoomInIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { analysisApi } from '../api/analysisApi';
import { FASTAPI_URL } from '../api/axiosInstance';

function AnalysisDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchAnalysis();
  }, [id]);

  const fetchAnalysis = async () => {
    try {
      const response = await analysisApi.getAnalysis(id);
      setAnalysis(response);
    } catch (err) {
      setError('분석 결과를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getChartIcon = (type) => {
    switch (type) {
      case 'bar': return <BarChartIcon />;
      case 'pie': return <PieChartIcon />;
      case 'line': return <LineChartIcon />;
      case 'scatter': return <ScatterIcon />;
      case 'heatmap': return <HeatmapIcon />;
      default: return <BarChartIcon />;
    }
  };

  const getChartLabel = (type) => {
    switch (type) {
      case 'bar': return '막대 차트';
      case 'pie': return '파이 차트';
      case 'line': return '라인 차트';
      case 'scatter': return '산점도';
      case 'heatmap': return '히트맵';
      default: return '차트';
    }
  };

  // resultData에서 파싱된 데이터 추출
  const parsedData = analysis?.resultData ? JSON.parse(analysis.resultData) : null;
  const charts = parsedData?.charts || [];
  const statistics = parsedData?.statistics || {};
  const preview = parsedData?.preview || { columns: [], data: [] };

  // 차트 URL 생성 함수
  const getChartFullUrl = (chartUrl) => {
    if (!chartUrl) return '';
    // 상대 경로인 경우 FASTAPI_URL과 결합
    if (chartUrl.startsWith('/')) {
      return `${FASTAPI_URL}${chartUrl}`;
    }
    // 이미 전체 URL인 경우 그대로 반환
    return chartUrl;
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Skeleton variant="text" width={200} height={40} />
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 3 }} />
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((i) => (
              <Grid item xs={12} sm={6} key={i}>
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar>
            <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" fontWeight={700} color="primary">
              분석 결과
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* 앱바 */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: 'white', 
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight={700} color="primary">
              분석 결과
            </Typography>
          </Box>
          <Button
            startIcon={<DownloadIcon />}
            variant="outlined"
            size="small"
            sx={{ display: { xs: 'none', sm: 'flex' } }}
          >
            보고서 다운로드
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {/* 파일 정보 헤더 */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {analysis?.fileName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {analysis?.createdAt && formatDate(analysis.createdAt)}
                </Typography>
              </Box>
            </Box>
            <Chip 
              label={`차트 ${charts.length}개`} 
              color="primary" 
              variant="outlined"
            />
          </Box>
          
          {analysis?.summary && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" color="text.secondary">
                {analysis.summary}
              </Typography>
            </>
          )}
        </Paper>

        {/* 탭 네비게이션 */}
        <Paper elevation={0} sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)}
            variant={isMobile ? 'fullWidth' : 'standard'}
            sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
          >
            <Tab icon={<BarChartIcon />} label="시각화" iconPosition="start" />
            <Tab icon={<TableChartIcon />} label="통계" iconPosition="start" />
            <Tab icon={<FileIcon />} label="데이터 미리보기" iconPosition="start" />
          </Tabs>
        </Paper>

        {/* 시각화 탭 */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            {charts.length === 0 ? (
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    textAlign: 'center',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <BarChartIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">
                    생성된 차트가 없습니다.
                  </Typography>
                </Paper>
              </Grid>
            ) : (
              charts.map((chart, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card
                    elevation={0}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 3,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)',
                        transform: 'translateY(-4px)',
                      },
                    }}
                    onClick={() => setSelectedImage(getChartFullUrl(chart.url))}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height={280}
                        image={getChartFullUrl(chart.url)}
                        alt={chart.type || chart.chart_type}
                        sx={{ objectFit: 'contain', bgcolor: '#fafafa', p: 2 }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'rgba(0,0,0,0.4)',
                          opacity: 0,
                          transition: 'opacity 0.2s ease',
                          '&:hover': { opacity: 1 },
                        }}
                      >
                        <ZoomInIcon sx={{ fontSize: 48, color: 'white' }} />
                      </Box>
                    </Box>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getChartIcon(chart.type || chart.chart_type)}
                        <Typography variant="subtitle1" fontWeight={600}>
                          {chart.title || getChartLabel(chart.type || chart.chart_type)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {/* 통계 탭 */}
        {tabValue === 1 && (
          <Grid container spacing={3}>
            {Object.keys(statistics).length === 0 ? (
              <Grid item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 5,
                    textAlign: 'center',
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <TableChartIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">
                    통계 데이터가 없습니다.
                  </Typography>
                </Paper>
              </Grid>
            ) : (
              Object.entries(statistics).map(([columnName, stats]) => (
                <Grid item xs={12} md={6} key={columnName}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {columnName}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Grid container spacing={2}>
                      {stats.count !== undefined && (
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">개수</Typography>
                          <Typography variant="h6" fontWeight={600}>{stats.count?.toLocaleString()}</Typography>
                        </Grid>
                      )}
                      {stats.mean !== undefined && (
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">평균</Typography>
                          <Typography variant="h6" fontWeight={600}>{typeof stats.mean === 'number' ? stats.mean.toFixed(2) : stats.mean}</Typography>
                        </Grid>
                      )}
                      {stats.std !== undefined && (
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">표준편차</Typography>
                          <Typography variant="h6" fontWeight={600}>{typeof stats.std === 'number' ? stats.std.toFixed(2) : stats.std}</Typography>
                        </Grid>
                      )}
                      {stats.min !== undefined && (
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">최솟값</Typography>
                          <Typography variant="h6" fontWeight={600}>{typeof stats.min === 'number' ? stats.min.toLocaleString() : stats.min}</Typography>
                        </Grid>
                      )}
                      {stats.max !== undefined && (
                        <Grid item xs={6}>
                          <Typography variant="body2" color="text.secondary">최댓값</Typography>
                          <Typography variant="h6" fontWeight={600}>{typeof stats.max === 'number' ? stats.max.toLocaleString() : stats.max}</Typography>
                        </Grid>
                      )}
                      {stats['25%'] !== undefined && (
                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">25%</Typography>
                          <Typography variant="subtitle1" fontWeight={600}>{typeof stats['25%'] === 'number' ? stats['25%'].toFixed(2) : stats['25%']}</Typography>
                        </Grid>
                      )}
                      {stats['50%'] !== undefined && (
                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">중앙값</Typography>
                          <Typography variant="subtitle1" fontWeight={600}>{typeof stats['50%'] === 'number' ? stats['50%'].toFixed(2) : stats['50%']}</Typography>
                        </Grid>
                      )}
                      {stats['75%'] !== undefined && (
                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">75%</Typography>
                          <Typography variant="subtitle1" fontWeight={600}>{typeof stats['75%'] === 'number' ? stats['75%'].toFixed(2) : stats['75%']}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {/* 데이터 미리보기 탭 */}
        {tabValue === 2 && (
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            {preview.columns.length === 0 ? (
              <Box sx={{ p: 5, textAlign: 'center' }}>
                <FileIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography color="text.secondary">
                  미리보기 데이터가 없습니다.
                </Typography>
              </Box>
            ) : (
              <TableContainer sx={{ maxHeight: 500 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      {preview.columns.map((col, index) => (
                        <TableCell 
                          key={index}
                          sx={{ 
                            fontWeight: 700, 
                            bgcolor: 'primary.main', 
                            color: 'white',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {col}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {preview.data.map((row, rowIndex) => (
                      <TableRow 
                        key={rowIndex}
                        sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}
                      >
                        {preview.columns.map((col, colIndex) => (
                          <TableCell key={colIndex} sx={{ whiteSpace: 'nowrap' }}>
                            {row[col] !== null && row[col] !== undefined ? String(row[col]) : '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}
      </Container>

      {/* 이미지 확대 다이얼로그 */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
        fullWidth
      >
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={() => setSelectedImage(null)}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Chart"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '80vh',
                objectFit: 'contain',
              }}
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
}

export default AnalysisDetailPage;
