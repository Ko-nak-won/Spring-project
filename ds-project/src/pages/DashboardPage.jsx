import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Paper,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Analytics as AnalyticsIcon,
  CloudUpload as CloudUploadIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { analysisApi } from '../api/analysisApi';
import AnalysisResult from '../components/AnalysisResult';

function DashboardPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const userName = localStorage.getItem('userName') || '사용자';
  
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (file) => {
    const allowedExtensions = ['.csv', '.json', '.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      setError('지원하지 않는 파일 형식입니다. CSV, JSON, Excel 파일만 업로드 가능합니다.');
      return;
    }

    setFile(file);
    setError('');
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('파일을 선택해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      let response;
      
      if (token) {
        const responseText = await analysisApi.uploadFile(file);
        response = typeof responseText === 'string' ? JSON.parse(responseText) : responseText;
      } else {
        response = await analysisApi.uploadFileDirect(file);
      }
      
      setResult(response);
    } catch (err) {
      setError(err.message || '분석 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError('');
  };

  const mobileDrawer = (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    >
      <Box sx={{ width: 250, pt: 2 }}>
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            안녕하세요, {userName}님
          </Typography>
        </Box>
        <Divider />
        <List>
          <ListItem button onClick={() => { navigate('/mypage'); setMobileMenuOpen(false); }}>
            <ListItemIcon><PersonIcon /></ListItemIcon>
            <ListItemText primary="마이페이지" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText primary="로그아웃" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );

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
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
              }}
            >
              <AnalyticsIcon sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Typography variant="h6" fontWeight={700} color="primary">
              Drop & See
            </Typography>
          </Box>

          {isMobile ? (
            <IconButton onClick={() => setMobileMenuOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                안녕하세요, <strong>{userName}</strong>님
              </Typography>
              <Button
                startIcon={<PersonIcon />}
                onClick={() => navigate('/mypage')}
                sx={{ color: 'text.secondary' }}
              >
                마이페이지
              </Button>
              <Button
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                color="error"
              >
                로그아웃
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {mobileDrawer}

      {/* 메인 컨텐츠 */}
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {!result ? (
          <Box>
            {/* 헤더 */}
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Typography variant="h3" fontWeight={700} color="text.primary" gutterBottom>
                파일을 업로드하세요
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight={400}>
                CSV, JSON, Excel 파일을 드래그하거나 클릭하여 업로드하면
                <br />
                자동으로 데이터를 분석하고 시각화합니다
              </Typography>
            </Box>

            {/* 업로드 영역 */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                border: '2px dashed',
                borderColor: isDragging ? 'primary.main' : file ? 'success.main' : 'divider',
                bgcolor: isDragging ? 'primary.50' : file ? 'success.50' : 'background.paper',
                borderRadius: 4,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50',
                },
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                type="file"
                id="file-input"
                accept=".csv,.json,.xlsx,.xls"
                onChange={handleFileChange}
                hidden
              />
              
              <Box sx={{ textAlign: 'center' }}>
                {file ? (
                  <Box>
                    <FileIcon sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      {file.name}
                    </Typography>
                    <Chip
                      label={`${(file.size / 1024).toFixed(2)} KB`}
                      color="success"
                      variant="outlined"
                    />
                  </Box>
                ) : (
                  <Box>
                    <CloudUploadIcon 
                      sx={{ 
                        fontSize: 80, 
                        color: isDragging ? 'primary.main' : 'text.disabled',
                        mb: 2,
                      }} 
                    />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      파일을 여기에 드래그하거나 클릭하세요
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      지원 형식: CSV, JSON, Excel (.xlsx, .xls)
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>

            {/* 에러 메시지 */}
            {error && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {error}
              </Alert>
            )}

            {/* 버튼 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AnalyticsIcon />}
                onClick={handleAnalyze}
                disabled={!file || loading}
                sx={{
                  px: 5,
                  py: 1.5,
                  fontSize: '1.1rem',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                }}
              >
                {loading ? '분석 중...' : '분석 시작'}
              </Button>
              
              {file && (
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<RefreshIcon />}
                  onClick={handleReset}
                  sx={{ px: 4, py: 1.5 }}
                >
                  초기화
                </Button>
              )}
            </Box>
          </Box>
        ) : (
          <Box>
            <Button
              startIcon={<RefreshIcon />}
              onClick={handleReset}
              sx={{ mb: 3 }}
            >
              새 파일 분석하기
            </Button>
            <AnalysisResult result={result} />
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default DashboardPage;
