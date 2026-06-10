import { type ChangeEvent, type FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import {
  Alert,
  AlertIcon,
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Progress,
  Stack,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { SmallCloseIcon } from '@chakra-ui/icons'
import AppButton from '../common/AppButton'
import AppInput from '../common/AppInput'
import AppLoader from '../common/AppLoader'
import AppTextarea from '../common/AppTextarea'
import { AppToast } from '../common/appToast'
import { uploadVideo, type VideoAsset } from '../../service/api'
import { ALLOWED_VIDEO_TYPES_VALIDATION_MESSAGE, DESCRIPTION_REQUIRED_FIELD_VALIDATION_MESSAGE, MAX_DESCRIPTION_LENGTH_VALIDATION_MESSAGE, MAX_TITLE_LENGTH_VALIDATION_MESSAGE, MAX_VIDEO_SIZE_VALIDATION_MESSAGE, TITLE_REQUIRED_FIELD_VALIDATION_MESSAGE, VIDEO_REQUIRED_FIELD_VALIDATION_MESSAGE } from '../../constants/validation'

type FormValues = {
  title: string
  description: string
  video: File | null
}

type FormErrors = Partial<Record<keyof FormValues, string>>

type VideoUploadFormProps = {
  onUploaded?: (video: VideoAsset) => Promise<void> | void
}

const initialValues: FormValues = {
  title: '',
  description: '',
  video: null,
}

let uploadFormDraft: FormValues = initialValues
type UploadRuntime = {
  isUploading: boolean
  progress: number
  successMessage: string
}

const initialUploadRuntime: UploadRuntime = {
  isUploading: false,
  progress: 0,
  successMessage: '',
}

let uploadRuntime = initialUploadRuntime
const uploadRuntimeListeners = new Set<(runtime: UploadRuntime) => void>()

const saveUploadFormDraft = (values: FormValues) => {
  uploadFormDraft = values
}

const clearUploadFormDraft = () => {
  uploadFormDraft = initialValues
}

const updateUploadRuntime = (nextRuntime: Partial<UploadRuntime>) => {
  uploadRuntime = { ...uploadRuntime, ...nextRuntime }
  uploadRuntimeListeners.forEach((listener) => listener(uploadRuntime))
}

const resetUploadRuntime = () => {
  updateUploadRuntime(initialUploadRuntime)
}

const maxVideoSize = 500 * 1024 * 1024
const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime']

function LocalVideoPreview({ src, title }: { src: string; title: string }) {
  return (
    <Box overflow="hidden" rounded="lg" bg="#111" border="1px solid" borderColor="blackAlpha.200">
      <Box
        as="video"
        src={src}
        title={title}
        controls
        playsInline
        preload="metadata"
        w="100%"
        aspectRatio={16 / 9}
        display="block"
        bg="black"
        objectFit="contain"
      />
    </Box>
  )
}

function VideoUploadForm({ onUploaded }: VideoUploadFormProps) {
  const [values, setValues] = useState<FormValues>(uploadFormDraft)
  const [submittedVideo, setSubmittedVideo] = useState<File | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [successMessage, setSuccessMessage] = useState(uploadRuntime.successMessage)
  const [isUploading, setIsUploading] = useState(uploadRuntime.isUploading)
  const [uploadProgress, setUploadProgress] = useState(uploadRuntime.progress)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const toast = useToast()
  const cardBg = useColorModeValue('white', 'whiteAlpha.100')
  const borderColor = useColorModeValue('blackAlpha.100', 'whiteAlpha.100')
  const headingColor = useColorModeValue('#172033', 'white')
  const mutedColor = useColorModeValue('blackAlpha.600', 'whiteAlpha.600')
  const dropzoneBg = useColorModeValue('#f7faf9', 'whiteAlpha.100')
  const dropzoneBorder = useColorModeValue('blackAlpha.300', 'whiteAlpha.300')
  const submitBg = useColorModeValue('#171514', '#e11d48')
  const submitHoverBg = useColorModeValue('#254b45', '#be123c')

  const videoPreviewUrl = useMemo(() => {
    if (!values.video) {
      return ''
    }

    return URL.createObjectURL(values.video)
  }, [values.video])
  const displayVideo = values.video ?? submittedVideo
  const progressValue = isUploading
    ? uploadProgress
    : successMessage
      ? 100
      : Math.min(((displayVideo?.size ?? 0) / maxVideoSize) * 100, 100)

  useEffect(() => {
    return () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl)
      }
    }
  }, [videoPreviewUrl])

  useEffect(() => {
    const syncUploadRuntime = (runtime: UploadRuntime) => {
      setIsUploading(runtime.isUploading)
      setUploadProgress(runtime.progress)
      setSuccessMessage(runtime.successMessage)
    }

    uploadRuntimeListeners.add(syncUploadRuntime)
    syncUploadRuntime(uploadRuntime)

    return () => {
      uploadRuntimeListeners.delete(syncUploadRuntime)
    }
  }, [])

  const handleTextChange =
    (field: keyof Omit<FormValues, 'video'>) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValues((current) => {
        const nextValues = { ...current, [field]: event.target.value }
        saveUploadFormDraft(nextValues)
        return nextValues
      })
      setErrors((current) => ({ ...current, [field]: undefined }))
      resetUploadRuntime()
    }

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null
    setValues((current) => {
      const nextValues = { ...current, video: selectedFile }
      saveUploadFormDraft(nextValues)
      return nextValues
    })
    setSubmittedVideo(null)
    setErrors((current) => ({ ...current, video: undefined }))
    resetUploadRuntime()
  }

  const removeVideo = () => {
    setValues((current) => {
      const nextValues = { ...current, video: null }
      saveUploadFormDraft(nextValues)
      return nextValues
    })
    setSubmittedVideo(null)
    setErrors((current) => ({ ...current, video: undefined }))
    resetUploadRuntime()

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateForm = () => {
    const nextErrors: FormErrors = {}

    if (!values.title.trim()) {
      nextErrors.title = TITLE_REQUIRED_FIELD_VALIDATION_MESSAGE
    } else if (values.title.trim().length < 3) {
      nextErrors.title = MAX_TITLE_LENGTH_VALIDATION_MESSAGE
    }

    if (!values.description.trim()) {
      nextErrors.description = DESCRIPTION_REQUIRED_FIELD_VALIDATION_MESSAGE
    } else if (values.description.trim().length < 10) {
      nextErrors.description = MAX_DESCRIPTION_LENGTH_VALIDATION_MESSAGE
    }

    if (!values.video) {
      nextErrors.video = VIDEO_REQUIRED_FIELD_VALIDATION_MESSAGE
    } else if (!allowedVideoTypes.includes(values.video.type)) {
      nextErrors.video = ALLOWED_VIDEO_TYPES_VALIDATION_MESSAGE
    } else if (values.video.size > maxVideoSize) {
      nextErrors.video = MAX_VIDEO_SIZE_VALIDATION_MESSAGE
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    updateUploadRuntime({ successMessage: '' })

    if (!validateForm() || !values.video) {
      return
    }

    try {
      updateUploadRuntime({ isUploading: true, progress: 0, successMessage: '' })
      const uploaded = await uploadVideo(
        {
          title: values.title.trim(),
          description: values.description.trim(),
          video: values.video,
        },
        (progressEvent) => {
          if (!progressEvent.total) {
            return
          }
          const nextProgress = Math.round((progressEvent.loaded * 95) / progressEvent.total)
          updateUploadRuntime({ progress: Math.min(nextProgress, 95) })
        },
      )

      await onUploaded?.(uploaded)
      const nextSuccessMessage = uploaded.responseMessage ?? 'Your video was uploaded successfully.'
      clearUploadFormDraft()
      setSubmittedVideo(null)
      setValues(initialValues)
      setErrors({})
      updateUploadRuntime({
        isUploading: false,
        progress: 100,
        successMessage: nextSuccessMessage,
      })
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      AppToast(toast, {
        title: 'Video uploaded',
        description: nextSuccessMessage,
        status: 'success',
      })
    } catch (error) {
      const description = error instanceof Error ? error.message : 'Please try again.'
      AppToast(toast, {
        title: 'Upload failed',
        description,
        status: 'error',
      })
      updateUploadRuntime({ isUploading: false })
    } finally {
      updateUploadRuntime({ isUploading: false })
    }
  }

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      rounded="2xl"
      p={{ base: 5, md: 8 }}
      boxShadow="0 24px 70px rgba(23, 32, 51, 0.12)"
      position="relative"
    >
      {isUploading && <AppLoader label="Uploading and processing video" progress={uploadProgress} />}
      {successMessage && (
        <Alert status="success" rounded="xl" mb={6}>
          <AlertIcon />
          {successMessage}
        </Alert>
      )}

      <Stack spacing={5}>
        <FormControl isInvalid={Boolean(errors.title)} isRequired>
          <FormLabel fontWeight="bold" color={headingColor}>
            Video title
          </FormLabel>
          <AppInput
            value={values.title}
            onChange={handleTextChange('title')}
            isDisabled={isUploading}
            placeholder="Behind the scenes edit"
          />
          <FormErrorMessage>{errors.title}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={Boolean(errors.description)} isRequired>
          <FormLabel fontWeight="bold" color={headingColor}>
            Description
          </FormLabel>
          <AppTextarea
            minH="140px"
            value={values.description}
            onChange={handleTextChange('description')}
            isDisabled={isUploading}
            placeholder="Write a short summary for this video..."
          />
          <FormHelperText>{values.description.length}/10 minimum characters</FormHelperText>
          <FormErrorMessage>{errors.description}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={Boolean(errors.video)} isRequired>
          <FormLabel fontWeight="bold" color={headingColor}>
            Video file
          </FormLabel>
          <Box
            border="2px dashed"
            borderColor={errors.video ? 'red.300' : dropzoneBorder}
            rounded="xl"
            bg={dropzoneBg}
            p={5}
          >
            <AppInput
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleVideoChange}
              isDisabled={isUploading}
              display="none"
            />

            {values.video || submittedVideo ? (
              <Stack spacing={4}>
                {values.video && (
                  <LocalVideoPreview src={videoPreviewUrl} title={values.title || values.video.name} />
                )}
                <HStack justify="space-between" align="start" spacing={4}>
                  <Box minW={0}>
                    <Text fontWeight="bold" noOfLines={1}>
                      {displayVideo?.name}
                    </Text>
                    <Text fontSize="sm" color={mutedColor}>
                      {((displayVideo?.size ?? 0) / 1024 / 1024).toFixed(2)}MB
                    </Text>
                  </Box>
                  {values.video && (
                    <AppButton
                      leftIcon={<SmallCloseIcon />}
                      variant="outline"
                      colorScheme="red"
                      onClick={removeVideo}
                      isDisabled={isUploading}
                    >
                      Remove
                    </AppButton>
                  )}
                </HStack>
                <Progress
                  value={progressValue}
                  colorScheme={displayVideo && displayVideo.size > maxVideoSize ? 'red' : 'green'}
                  rounded="full"
                />
              </Stack>
            ) : (
              <Stack align="center" spacing={3} py={6} textAlign="center">
                <Text fontWeight="bold" color={headingColor}>
                  Choose your video file
                </Text>
                <Text fontSize="sm" color={mutedColor}>
                  MP4, WebM, or MOV up to 100MB
                </Text>
                <AppButton
                  type="button"
                  bg="#315f57"
                  color="white"
                  _hover={{ bg: '#254b45' }}
                  isDisabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse File
                </AppButton>
              </Stack>
            )}
          </Box>
          <FormErrorMessage>{errors.video}</FormErrorMessage>
        </FormControl>

        <AppButton
          type="submit"
          h="54px"
          bg={submitBg}
          color="white"
          fontWeight="bold"
          isLoading={isUploading}
          loadingText="Uploading"
          _hover={{ bg: submitHoverBg }}
        >
          Upload Video
        </AppButton>
      </Stack>
    </Box>
  )
}

export default VideoUploadForm
