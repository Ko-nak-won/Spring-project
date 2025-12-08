import { useState, useEffect } from 'react';
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
  Card,
  CardContent,
  CardActions,
  Grid,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  useTheme,
  useMediaQuery,
  Drawer,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Snackbar,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Analytics as AnalyticsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  ArrowBack as ArrowBackIcon,
  InsertDriveFile as FileIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  History as HistoryIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { analysisApi } from '../api/analysisApi';
import { authApi } from '../api/authApi';

function MyPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const userName = localStorage.getItem('userName') || '사용자';
  const userEmail = localStorage.getItem('userEmail') || '';
  
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  
  // 비밀번호 변경 관련 상태
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    if (historyLoaded) {
      setHistoryOpen(!historyOpen);
      return;
    }
    
    setLoading(true);
    try {
      const response = await analysisApi.getHistory();
      setHistory(response || []);
      setHistoryLoaded(true);
      setHistoryOpen(true);
    } catch (err) {
      setError('분석 이력을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  const handlePasswordChange = async () => {
    // 유효성 검사
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('모든 필드를 입력해주세요.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('새 비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    setPasswordLoading(true);
    setPasswordError('');
    
    try {
      await authApi.changePassword({
        currentPassword,
        newPassword,
      });
      setPasswordDialogOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSnackbarMessage('비밀번호가 성공적으로 변경되었습니다.');
      setSnackbarOpen(true);
    } catch (err) {
      setPasswordError(err.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleClosePasswordDialog = () => {
    setPasswordDialogOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
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
          <ListItem button onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }}>
            <ListItemAvatar><Avatar><AnalyticsIcon /></Avatar></ListItemAvatar>
            <ListItemText primary="대시보드" />
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemAvatar><Avatar><LogoutIcon /></Avatar></ListItemAvatar>
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
          <IconButton 
            onClick={() => navigate('/dashboard')}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700} color="primary" sx={{ flexGrow: 1 }}>
            마이페이지
          </Typography>

          {isMobile ? (
            <IconButton onClick={() => setMobileMenuOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                startIcon={<AnalyticsIcon />}
                onClick={() => navigate('/dashboard')}
              >
                대시보드
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
        <Grid container spacing={4}>
          {/* 프로필 카드 */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  mb: 2,
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  fontSize: '2.5rem',
                }}
              >
                {userName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {userName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
                <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {userEmail}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {/* 버튼 영역 */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<LockIcon />}
                  onClick={() => setPasswordDialogOpen(true)}
                  sx={{ py: 1.5 }}
                >
                  비밀번호 변경
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<HistoryIcon />}
                  endIcon={historyOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  onClick={fetchHistory}
                  disabled={loading}
                  sx={{ py: 1.5 }}
                >
                  {loading ? '불러오는 중...' : '분석 이력 조회'}
                </Button>
              </Box>
              
              {historyLoaded && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                    <Box>
                      <Typography variant="h4" fontWeight={700} color="primary">
                        {history.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        분석 횟수
                      </Typography>
                    </Box>
                  </Box>
                </>
              )}
            </Paper>
          </Grid>

          {/* 분석 이력 */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <HistoryIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>
                  분석 이력
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {!historyLoaded ? (
                <Box sx={{ textAlign: 'center', py: 5 }}>
                  <HistoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                  <Typography color="text.secondary">
                    분석 이력을 조회하려면 왼쪽의 '분석 이력 조회' 버튼을 클릭하세요.
                  </Typography>
                </Box>
              ) : (
                <Collapse in={historyOpen}>
                  {loading ? (
                    <Box>
                      {[1, 2, 3].map((i) => (
                        <Box key={i} sx={{ mb: 2 }}>
                          <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
                        </Box>
                      ))}
                    </Box>
                  ) : history.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 5 }}>
                      <FileIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                      <Typography color="text.secondary">
                        아직 분석 이력이 없습니다.
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => navigate('/dashboard')}
                        sx={{ mt: 2 }}
                      >
                        첫 분석 시작하기
                      </Button>
                    </Box>
                  ) : (
                    <List>
                      {history.map((item, index) => (
                        <Card
                          key={item.id || index}
                          elevation={0}
                          sx={{
                            mb: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                              borderColor: 'primary.main',
                              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.15)',
                            },
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                              <Avatar sx={{ bgcolor: 'primary.100' }}>
                                <FileIcon sx={{ color: 'primary.main' }} />
                              </Avatar>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle1" fontWeight={600}>
                                  {item.fileName}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                  <CalendarIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {formatDate(item.createdAt)}
                                  </Typography>
                                </Box>
                                {item.summary && (
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    sx={{ 
                                      mt: 1,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                    }}
                                  >
                                    {item.summary}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          </CardContent>
                          <CardActions sx={{ px: 2, pb: 2 }}>
                            <Button
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() => navigate(`/analysis/${item.id}`)}
                            >
                              상세 보기
                            </Button>
                          </CardActions>
                        </Card>
                      ))}
                    </List>
                  )}
                </Collapse>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* 비밀번호 변경 다이얼로그 */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={handleClosePasswordDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          비밀번호 변경
        </DialogTitle>
        <DialogContent>
          {passwordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {passwordError}
            </Alert>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="현재 비밀번호"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="새 비밀번호"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              helperText="최소 6자 이상 입력하세요"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="새 비밀번호 확인"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              error={confirmPassword !== '' && newPassword !== confirmPassword}
              helperText={confirmPassword !== '' && newPassword !== confirmPassword ? '비밀번호가 일치하지 않습니다' : ''}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClosePasswordDialog}>
            취소
          </Button>
          <Button 
            variant="contained" 
            onClick={handlePasswordChange}
            disabled={passwordLoading}
          >
            {passwordLoading ? '변경 중...' : '변경하기'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 성공 메시지 스낵바 */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}

export default MyPage;
