import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery,
  Button,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  TableChart as TableIcon,
  BarChart as ChartIcon,
  Tag as TagIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import { analysisApi } from '../api/analysisApi';

function AnalysisResult({ result }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!result) return null;

  return (
    <Box>
      {/* 헤더 */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: 'white',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              📊 {result.file_name}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              {result.summary}
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {result.row_count?.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>행</Typography>
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={700}>
                  {result.column_count}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>열</Typography>
              </Box>
            </Box>
          </Box>
          {result.analysis_id && (
            <Button
              variant="contained"
              startIcon={<OpenInNewIcon />}
              onClick={() => navigate(`/analysis/${result.analysis_id}`)}
              sx={{
                bgcolor: 'rgba(255,255,255,0.2)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.3)',
                },
              }}
            >
              상세보기
            </Button>
          )}
        </Box>
      </Paper>

      {/* 컬럼 목록 */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TagIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            컬럼 목록
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {result.columns?.map((col, idx) => (
            <Chip
              key={idx}
              label={col}
              variant="outlined"
              color="primary"
              sx={{ fontWeight: 500 }}
            />
          ))}
        </Box>
      </Paper>

      {/* 통계 테이블 */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TableIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            컬럼별 통계
          </Typography>
        </Box>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table stickyHeader size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>컬럼명</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }}>타입</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }} align="right">개수</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }} align="right">고유값</TableCell>
                <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }} align="right">결측치</TableCell>
                {!isMobile && (
                  <>
                    <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }} align="right">평균</TableCell>
                    <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }} align="right">최소</TableCell>
                    <TableCell sx={{ fontWeight: 700, bgcolor: 'grey.50' }} align="right">최대</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {result.statistics?.map((stat, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>
                    <Typography fontWeight={600}>{stat.column_name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={stat.data_type}
                      size="small"
                      sx={{
                        bgcolor: stat.data_type.includes('int') || stat.data_type.includes('float')
                          ? 'info.100'
                          : 'success.100',
                        color: stat.data_type.includes('int') || stat.data_type.includes('float')
                          ? 'info.dark'
                          : 'success.dark',
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">{stat.count?.toLocaleString()}</TableCell>
                  <TableCell align="right">{stat.unique?.toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <Typography
                      color={stat.missing > 0 ? 'error' : 'text.primary'}
                      fontWeight={stat.missing > 0 ? 600 : 400}
                    >
                      {stat.missing}
                    </Typography>
                  </TableCell>
                  {!isMobile && (
                    <>
                      <TableCell align="right">
                        {stat.mean != null ? stat.mean.toFixed(2) : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {stat.min != null ? stat.min.toFixed(2) : '-'}
                      </TableCell>
                      <TableCell align="right">
                        {stat.max != null ? stat.max.toFixed(2) : '-'}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 차트 섹션 */}
      {result.charts && result.charts.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <ChartIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              시각화
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {result.charts.map((chart, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Card
                  elevation={0}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    overflow: 'hidden',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    },
                    transition: 'box-shadow 0.3s ease',
                  }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {chart.title}
                    </Typography>
                  </CardContent>
                  <CardMedia
                    component="img"
                    image={analysisApi.getChartUrl(result.file_id, chart.chart_type)}
                    alt={chart.title}
                    sx={{
                      height: 280,
                      objectFit: 'contain',
                      bgcolor: 'grey.50',
                      p: 1,
                    }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
}

export default AnalysisResult;
